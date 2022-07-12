import {Builder, Browser, By, Key, until} from 'selenium-webdriver';
import Chorme from 'selenium-webdriver/chrome';
import DoubleModel from '@/models/DoubleModel';

const ExtractDataByArray = async (resultArray, driver) => {
    let resultDiv = await resultArray[0].findElement(By.className('roulette-tile'))
    let getColor = await resultDiv.findElement(By.className('sm-box')).getAttribute('class')
    getColor = getColor.replace("sm-box ", '')
    let getNumber = null
    if(getColor != 'white'){
        getNumber = await resultDiv.findElement(By.className('number')).getText()
        while(getNumber == ''){
            getNumber = await resultDiv.findElement(By.className('number')).getText()
            await new Promise(r => setTimeout(r, 200));
        }
    }else{
        getNumber = 0
    }
    parseInt(getNumber)
    const Timestamp = Date.now();
    const Result = {
        'Color' : getColor,
        'Number' : getNumber,
        'Timestamp' : Timestamp,
    }
    
    const newDouble = new DoubleModel({
        number: getNumber,
        timestamp: Timestamp,
        color: getColor,
    })

    newDouble.save();

    return Result
}


export default () => {
    return new Promise(async (resolve, reject) => {
        const screen = {
            width: 1920,
            height: 1080
        };
        console.log("Iniciou o scrapping do Double")
        let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(new Chorme.Options().headless().windowSize(screen).addArguments("--log-level=3",'--no-sandbox', "--disable-dev-shm-usage", '--disable-gpu',"--test-type", "--no-first-run","--no-default-browser-check","--ignore-certificate-errors","--start-maximized")).build();
        try {
            await driver.get('https://blaze.com/en/games/double');
            
            driver.takeScreenshot().then(
                function(image) {
                    require('fs').writeFileSync('captured_image_double.png', image, 'base64');
                }
            );
            await driver.wait(until.elementLocated(By.className('entry')), 30000);
            let extractActual = 0


            let arrayResult = await driver.findElement(By.className('entries main')).findElements(By.className('entry'))
            let lastSize = arrayResult.length
            while(true){
                if(lastSize > 0){
                    if(extractActual == 2){
                        extractActual = 0
                        lastSize = 0
                        driver.navigate().refresh()
                    }else{
                        arrayResult = await driver.findElement(By.className('entries main')).findElements(By.className('entry'))
                        if(lastSize < arrayResult.length){
                            lastSize = arrayResult.length
                            extractActual+=1
                            let lastItemExtract = await ExtractDataByArray(arrayResult, driver)
                            console.log(lastItemExtract)
                        }
                    }

                }else{
                    arrayResult = await driver.findElement(By.className('entries main')).findElements(By.className('entry'))
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