const template = document.createElement('template')
template.innerHTML = `
    <style>
        .column {
            box-sizing: border-box;
            float: left;
        }
        .column.half{
            width: 50%!important;
        } 
        .address-form {
            padding : 0 50px
        }
        h3 {
            text-align: center;
            font-size: 22px;
            
        }
        input {
            width: 100%;
            padding: 10px 20px;
            box-sizing: border-box;
            border-radius: 5px;
            margin: 6px 0
        }
        label {
            width: 10%;
            display: inline-block;
            color: #616161s;
        }
        button {
            margin: 30px auto;
            width: 120px;
            height: 30px;
            border-radius: 5px;
            border-style: none;
            background-color: aqua;
            display: block;
        }
    </style>

    <div class="address-form">
        <h3><slot /></h3>
        
        <form id='address-form'>
            <label for="zip">ZIP</label>
            <input type="text" name='zip'  id='zip' required>
            <label for="city">City</label>
            <input type="text" name='city' list='city_list' id='city' required>
            <datalist id="city_list">
                <option value="Munich">
                <option value="Berlin">
                <option value="Hamburg">
                <option value="Cologne">
                <option value="Dortmund">
                <option value="Stuttgart">
                <option value="Düsseldorf">
                <option value="Essen">
                <option value="Leipzig">
            </datalist>
            <label for="street">Street</label>
            <input type="text" name='street' id='street' list='street' required>
            <label for="houseNo">House No.</label>
            <input type="text" name='houseNo' id='houseNo' required>
            <label for="country">Country</label>
            <input type="text" name='country' id='country' required value='Deutschland' readonly>
            
            <button id='submit-address'>Info</button>
        </form>

        <datalist id="street">
        </datalist>
    </div>
`

class AddressForm extends HTMLElement {
    constructor() {
        super();

        this.formValues = {}

        this.attachShadow({mode: 'open'})
        this.shadowRoot.appendChild(template.content.cloneNode(true))
    }

    getCity(zipcode) {
        if(zipcode.length === 5){
            fetch(`https://api.zippopotam.us/de/${zipcode}`)
            .then(response => response.json())
            .then(data => {
                const test = data.places[0]
                this.shadowRoot.getElementById("city").value = data.places[0].state
                this.shadowRoot.getElementById("street").value = test['place name']
            })
            .catch(error => console.error(error))
        }
    }

    submitForm(e) {
        e.preventDefault()
        this.formValues.zip = this.shadowRoot.getElementById("zip").value;
        this.formValues.city = this.shadowRoot.getElementById("city").value;
        this.formValues.street = this.shadowRoot.getElementById("street").value;
        this.formValues.houseNo = this.shadowRoot.getElementById("houseNo").value;
        this.formValues.country = this.shadowRoot.getElementById("country").value;
        this.shadowRoot.querySelector('.json-data').innerHTML = this.formValues
    }

      connectedCallback() {
        this.shadowRoot.querySelector('#address-form').addEventListener('submit', (e) => this.submitForm(e))
        this.shadowRoot.querySelector('#zip').addEventListener('input', (e) => this.getCity(e.target.value))
    }

    disconnectedCallback() {
        this.shadowRoot.querySelector('#address-form').removeEventListener()
    }


}

window.customElements.define('address-form', AddressForm)