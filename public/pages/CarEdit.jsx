const { useNavigate, useParams } = ReactRouterDOM

const { useState, useEffect } = React
import { carService } from "../services/car.service.js";



export function CarEdit() {

    const [carToEdit, setCarToEdit] = useState(carService.getEmptyCar())
    const navigate = useNavigate()
    const { carId } = useParams()

    useEffect(() => {
        if (carId) loadCar()
    }, [])

    function loadCar() {
        carService.get(carId)
            .then(setCarToEdit)
            .catch(err => console.log('err:', err))
    }

    function onSaveCar(ev) {
        ev.preventDefault()
        carService.save(carToEdit)
            .then(() => {
                navigate('/car')
                showSuccessMsg(`Car saved successfully!`)
            })
            .catch(err => console.log('err:', err))
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break

            default:
                break;
        }

        setCarToEdit(prevCar => ({ ...prevCar, [field]: value }))
    }


    const { vendor, speed } = carToEdit
    return (
        <section className="car-edit">
            <h1>{carId ? 'Edit':'Add'} Car</h1>
            <form onSubmit={onSaveCar}>
                <label htmlFor="vendor">Vendor</label>
                <input onChange={handleChange} value={vendor} type="text" name="vendor" id="vendor" />

                <label htmlFor="speed">Speed</label>
                <input onChange={handleChange} value={speed} type="number" name="speed" id="speed" />

                <button>Save</button>
            </form>

        </section>
    )

}