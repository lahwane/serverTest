import express from 'express'
import { carService } from './services/car.service.js'
import { loggerService } from './services/logger.service.js'
import cookieParser from 'cookie-parser'
const app = express()

//* Express Config:
app.use(express.static('public'))
app.use(cookieParser())


//* Express Routing:
//* Read
app.get('/api/car', (req, res) => {
    carService.query()
        .then(cars => res.send(cars))
        .catch(err => {
            loggerService.error('Cannot get cars', err)
            res.status(500).send('Cannot load cars')
        })
})

//* Create/Edit
app.get('/api/car/save', (req, res) => {
    const carToSave = {
        _id: req.query._id,
        vendor: req.query.vendor,
        speed: +req.query.speed
    }

    carService.save(carToSave)
        .then(car => res.send(car))
        .catch(err => {
            loggerService.error('Cannot save car', err)
            res.status(500).send('Cannot save car')
        })
})


//* Get/Read by id
app.get('/api/car/:carId', (req, res) => {
    const { carId } = req.params
    carService.getById(carId)
        .then(car => res.send(car))
        .catch(err => {
            loggerService.error('Cannot get car', err)
            res.status(500).send('Cannot load car')
        })
})



//* Remove/Delete
app.get('/api/car/:carId/remove', (req, res) => {
    const { carId } = req.params
    carService.remove(carId)
        .then(() => res.send('Car Removed'))
        .catch(err => {
            loggerService.error('Cannot remove car', err)
            res.status(500).send('Cannot remove car')
        })
})



app.get('/', (req, res) => {
    res.send('Hello And Welcome')
})

app.get('/puki', (req, res) => {
    res.send('<h1>Hello And Welcome <u>Puki!</u></h1>')
})

app.get('/nono', (req, res) => res.redirect('/puki'))

app.get('/api/yesno', (req, res) => {
    res.send({
        answer: Math.random() < 0.5 ? 'Yes' : 'No',
        img: 'https://picsum.photos/200/300?random=10'
    })
})

app.get('/cookies', (req, res) => {
    let visitedCount = req.cookies.visitedCount || 0
    visitedCount++
    console.log('visitedCount:', visitedCount)
    res.cookie('visitedCount', visitedCount, { maxAge: 5 * 1000 })
    // console.log('visitedCount:', visitedCount)
    res.send('Hello Puki')
})


//!Example
app.get('/api/logs', (req, res) => {
    res.sendFile(process.cwd() + '/logs/backend.log')
})


const port = 3030
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)
