/**
 * We're using v6 of puppeteer-core and chrome-aws-lambda so we fit in the 50mb limit
 * of Next.js serverless functions. They've got larger since then and we don't need
 * any new features
 */

import { args, defaultViewport, executablePath, puppeteer } from "chrome-aws-lambda"
import { NextApiHandler } from "next"

const handler: NextApiHandler = async (req, res) => {
  const { username } = req.query

  const browser = await puppeteer.launch({
    args: [...args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: defaultViewport,
    executablePath:
      process.env.NODE_ENV === "production" ? await executablePath : undefined,
    headless: true,
  })

  try {
    const page = await browser.newPage()
    await page.goto(`https://twitter.com/${username}`)

    const type = await Promise.any([
      page
        .waitForSelector('a[href$="/photo"] img[src]', { timeout: 1000 })
        .then(() => "photo"),
      page
        .waitForSelector('a[href$="/nft"] img[src]', { timeout: 1000 })
        .then(() => "nft"),
    ]).catch(() => {
      throw Error(`Unable to retrieve avatar for user ${username}`)
    })

    const url = await page.evaluate(
      type === "photo"
        ? () =>
            (document.querySelector(`a[href$="/photo"] img`) as HTMLImageElement).src
        : () =>
            (document.querySelector(`a[href$="/nft"] img`) as HTMLImageElement).src
    )
    res.status(200).json({ url })
  } catch (error) {
    res.status(500).json({ message: error?.message || "Unknown error" })
  } finally {
    await browser.close()
  }
}

export default handler
