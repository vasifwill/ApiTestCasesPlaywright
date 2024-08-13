import { test, expect, request } from '@playwright/test';
import tags from '../test-data/tags.json'

test.beforeEach(async({page}) => {
  await page.route('https://conduit-api.bondaracademy.com/api/tags', async route => {

  await route.fulfill({
  body: JSON.stringify(tags)
})
  })
await page.goto('https://conduit.bondaracademy.com/')
await page.getByText('Sign in').click()
await page.getByPlaceholder('Email').fill('test@test56.com')
await page.getByPlaceholder('Password').fill('Baxter2020')
await page.getByRole('button').click()
  })


  
test('has title', async ({ page }) => {

  await page.route('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', async route => { 
    const response = await route.fetch()
    const responseBody = await response.json()

    responseBody.articles[0].title = 'This is me Vasif Mamedov'
    responseBody.articles[0].description = 'this is me again Vasif Mamedov'

    await route.fulfill({
      body: JSON.stringify(responseBody)
    })
  });
  
  await page.getByText('Global Feed').click()
  const titleText = page.locator('.navbar-brand')
  await expect(titleText).toHaveText('conduit')

  await expect(page.locator('app-article-list h1').first()).toContainText('This is me Vasif Mamedov')
  await expect(page.locator('app-article-list p').first()).toContainText('this is me again Vasif Mamedov')
  // page.waitForTimeout(1000)
})

test('login, get token, create article and delete article', async ({page, request}) => {
  //login
  const responseJson = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {
      "user": {"email": "test@test56.com", "password": "Baxter2020"}
    }
  })

  //get token from login response
  const responseBody = await responseJson.json()
  const tokenText = responseBody.user.token

  //create article

  const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article":{"title":"This is article is about Mazda cx50","description":"This is about Mazda","body":"a lot more about Mazda","tagList":[]}
    },
    headers: {
      Authorization: `Token ${tokenText}`
    }
  })

  //create assertaion to check api response status
  expect(articleResponse.status()).toEqual(201)


  //Delete article that we created

  await page.getByText('Global Feed').click()
  await page.getByText('This is article is about Mazda cx50').click()
  await page.getByRole('button', {name: 'Delete Article'}).first().click()
  await page.getByText('Global Feed').click()

  //simple validation 
  await expect(page.locator('app-article-list h1').first()).not.toContainText('This is article is about Mazda cx50')
})

