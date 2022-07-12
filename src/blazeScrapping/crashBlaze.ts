import CrashModel from '@/models/CrashModel';
import {Builder, Browser, By, Key, until} from 'selenium-webdriver';
import Chorme from 'selenium-webdriver/chrome';

const ExtractDataByArray = async (resultArray, driver) => {
    let getNumber = await resultArray[0].getText()
    while(getNumber == ''){
        let arrayResult = await driver.findElement(By.className('entries')).findElements(By.tagName('span'))
        getNumber = await arrayResult[0].getText()
    }
    getNumber = getNumber.replace('X', '')
    parseFloat(getNumber)
    const Timestamp = Date.now();
    const Result = {
        'Number' : getNumber,
        'Timestamp' : Timestamp,
    }
    const newCrash = new CrashModel({
        number: getNumber,
        timestamp: Timestamp,
    })

    newCrash.save();

    return Result
}


export default () => {
    return new Promise(async (resolve, reject) => {
        const screen = {
            width: 1920,
            height: 1080
        };
        console.log("Iniciou o scrapping do Crash")

        let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(new Chorme.Options().headless().windowSize(screen).addArguments("--log-level=3",'--no-sandbox', "--disable-dev-shm-usage", '--disable-gpu',"--test-type", "--no-first-run","--no-default-browser-check","--ignore-certificate-errors","--start-maximized")).build();
        try {
            await driver.get('https://blaze.com/en/games/crash');
            let extractActual = 0
            
            driver.takeScreenshot().then(
                function(image) {
                    require('fs').writeFileSync('captured_image_crash.png', image, 'base64');
                }
            );            
            let arrayResult = await driver.findElement(By.className('entries')).findElements(By.tagName('span'))
            let lastSize = arrayResult.length
            while(true){
                if(lastSize > 0){
                    if(extractActual == 2){
                        extractActual = 0
                        driver.navigate().refresh()
                        lastSize = 0
                    }else{
                        arrayResult = await driver.findElement(By.className('entries')).findElements(By.tagName('span'))
                        if(lastSize < arrayResult.length){
                            lastSize = arrayResult.length
                            let lastItemExtract = await ExtractDataByArray(arrayResult, driver)
                            extractActual += 1
                            console.log(lastItemExtract)
                        }
                    }

                }else{
                    arrayResult = await driver.findElement(By.className('entries')).findElements(By.tagName('span'))
                    lastSize = arrayResult.length
                }
            
                await new Promise(r => setTimeout(r, 1500));
            }
            
        } catch (error) {
            console.log(error)
        }finally {
            await driver.quit();
            resolve(true)
        } 
    })
}

