import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const CAR_KEY = 'carDB'
const BASE_URL = '/api/car/'
_createCars()

export const carService = {
    query,
    get,
    remove,
    save,
    getEmptyCar,
    getDefaultFilter,
    getFilterFromSearchParams
}

function query(filterBy = {}) {
    // return storageService.query(CAR_KEY)
    return axios.get(BASE_URL)
        .then(res => res.data)
        .then(cars => {
            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                cars = cars.filter(car => regExp.test(car.vendor))
            }
            if (filterBy.minSpeed) {
                cars = cars.filter(car => car.speed >= filterBy.minSpeed)
            }
            return cars
        })
}

function get(carId) {
    return axios.get(BASE_URL + carId)
        .then(res => res.data)
        .then(car => _setNextPrevCarId(car))
}

function remove(carId) {
    // return storageService.remove(CAR_KEY, carId)
    return axios.get(BASE_URL + carId + '/remove')
        .then(res => res.data)
}


function save(car) {
    const url = BASE_URL + 'save'
    let queryParams = `?vendor=${car.vendor}&speed=${car.speed}`
    if (car._id) queryParams += `&_id=${car._id}`
    return axios.get(url + queryParams)
        .then(res => res.data)
        .catch(err => {
            console.log('err:', err)
        })
}

function getEmptyCar(vendor = '', speed = '') {
    return { vendor, speed }
}

function getDefaultFilter() {
    return { txt: '', minSpeed: '' }
}


function getFilterFromSearchParams(searchParams) {
    const txt = searchParams.get('txt') || ''
    const minSpeed = searchParams.get('minSpeed') || ''
    return {
        txt,
        minSpeed
    }
}


function _createCars() {
    let cars = utilService.loadFromStorage(CAR_KEY)
    if (!cars || !cars.length) {
        cars = []
        cars.push(_createCar('audu', 300))
        cars.push(_createCar('fiak', 120))
        cars.push(_createCar('subali', 50))
        cars.push(_createCar('mitsu', 150))
        utilService.saveToStorage(CAR_KEY, cars)
    }
}

function _createCar(vendor, speed = 250) {
    const car = getEmptyCar(vendor, speed)
    car._id = utilService.makeId()
    return car
}


function _setNextPrevCarId(car) {
    return storageService.query(CAR_KEY).then((cars) => {
        const carIdx = cars.findIndex((currCar) => currCar._id === car._id)
        const nextCar = cars[carIdx + 1] ? cars[carIdx + 1] : cars[0]
        const prevCar = cars[carIdx - 1] ? cars[carIdx - 1] : cars[cars.length - 1]
        car.nextCarId = nextCar._id
        car.prevCarId = prevCar._id
        return car
    })
}