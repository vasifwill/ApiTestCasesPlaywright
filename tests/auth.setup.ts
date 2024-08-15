import {test as setup} from '@playwright/test'

const authFile = '.auth/user.json';

setup('login proccess', async({page}) =>{
    await page.goto('https://conduit.bondaracademy.com/')
    await page.getByText('Sign in').click()
    await page.getByPlaceholder('Email').fill('test@test56.com')
    await page.getByPlaceholder('Password').fill('Baxter2020')
    await page.getByRole('button').click()  
    await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags')

    
    await page.context().storageState({path: authFile})
})
