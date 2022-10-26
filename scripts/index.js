
const etiqueta = document.getElementById('etiqueta')
const items= document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()


let reservado = {}
let reservaTotal = []

class Cliente {
  constructor(nombre, apellido, mail, telefono, pasaporte, reservado){
    this.nombre = nombre,
    this.apellido = apellido,
    this.mail = mail,
    this.telefono = telefono,
    this.pasaporte = pasaporte,  
    this.reservaFinal = reservado
  }
}



document.addEventListener('DOMContentLoaded', () =>{
    fetchData();
    if(localStorage.getItem('reservado')){
      reservado = JSON.parse(localStorage.getItem('reservado'))
      pintarCarrito()
    }
    if(localStorage.getItem('reservaTotal')){
      reservaTotal = JSON.parse(localStorage.getItem('reservaTotal'))
      pintarCarrito()
    }
})



etiqueta.addEventListener('click', e =>{
    addReserva(e)
})




items.addEventListener('click', e =>{
  btnContador(e)
})



const fetchData = async () => {
    try {
       const res = await fetch('scripts/data.json')
       const data = await res.json()
       console.log(data)
       pintarCards(data)

    } catch (error) {
        console.log(error)
        
    }
}


const pintarCards = data =>{ 
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.destino
        templateCard.querySelector('p').textContent = producto.tarifa
        templateCard.querySelector('img').setAttribute("src", producto.img)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
        
    });
    etiqueta.appendChild(fragment)
}

const addReserva = e => {
    console.log(e.target)
    console.log(e.target.classList.contains('btn-dark'))
    if (e.target.classList.contains('btn-dark')) {
        setReserva(e.target.parentElement)

    }
   e.stopPropagation()

}

const setReserva = objeto => {
    console.log(objeto)
    const viaje = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        destino: objeto.querySelector('h5').textContent,
        tarifa: objeto.querySelector('p').textContent,
        cantidad: 1

    }
    if (reservado.hasOwnProperty(viaje.id)){
        viaje.cantidad = reservado[viaje.id].cantidad + 1
    }
    reservado [viaje.id] ={...viaje} 
    pintarCarrito()
   console.log(viaje)

}

const pintarCarrito = () =>{
items.innerHTML = ``  
     Object.values(reservado).forEach(viaje => {
      templateCarrito.querySelector('th').textContent = viaje.id
      templateCarrito.querySelectorAll('td')[0].textContent = viaje.destino
      templateCarrito.querySelectorAll('td')[1].textContent = viaje.cantidad
      templateCarrito.querySelector('.btn-info').dataset.id = viaje.id
      templateCarrito.querySelector('.btn-danger').dataset.id = viaje.id
      templateCarrito.querySelector('span').textContent = viaje.cantidad * viaje.tarifa
      templateCarrito.querySelectorAll('btnReservar').textContent = viaje.id

      const clonar = templateCarrito.cloneNode(true)
      fragment.appendChild(clonar)
     })   
     items.appendChild(fragment)
     pintarFooter()

     localStorage.setItem('reservado', JSON.stringify(reservado))
}

const pintarFooter = () => {
  footer.innerHTML = ``
  if (Object.keys(reservado).length === 0){
    footer.innerHTML = `
    <th scope="row" colspan="5">Carrito Vacio</th> `
    return
  }
  const sumarCantidad = Object.values(reservado).reduce((acc,{cantidad})=>acc + cantidad, 0)
  const sumarTotal = Object.values(reservado).reduce((acc, {cantidad, tarifa})=> acc + cantidad * tarifa,0)
  console.log(sumarCantidad)
  console.log(sumarTotal)
  templateFooter.querySelectorAll('td')[0].textContent = sumarCantidad
  templateFooter.querySelector('span').textContent = sumarTotal

  const clonar = templateFooter.cloneNode(true)
  fragment.appendChild(clonar)
  footer.appendChild(fragment)

  const btnBorrar = document.getElementById('vaciar-carrito')
  btnBorrar.addEventListener('click', ()=>{
    reservado = {}
    pintarCarrito()
  })
}

const btnReservar = document.getElementById('btnfile')
btnReservar.addEventListener('click', () =>{
  let contenedorFormulario = document.getElementById("formulario");
  contenedorFormulario.innerHTML = `
  <form id="formulario-contacto" action="">

  <div class="form-group"> 
      <label for="full_name_id" class="control-label">Nombre</label>
      <input type="text" class="form-control" id="nombre" name="from_name">
  </div>    

  <div class="form-group"> 
      <label for="street1_id" class="control-label">Apellido</label>
      <input type="text" class="form-control" id="apellido" name="to_name">
  </div>                    
                          
  <div class="form-group"> 
      <label for="street2_id" class="control-label">Email</label>
      <input type="text" class="form-control" id="mail" name="reply_to">
  </div>    
  <div class="form-group"> 
  <label for="street2_id" class="control-label">Telefono</label>
  <input type="text" class="form-control" id="telefono" name="reply_to">
</div>  

  <div class="form-group"> 
      <label for="city_id" class="control-label">Pasaporte</label>
      <input type="text" class="form-control" id="pasaporte" name="message">
  </div>                                    

  <div class="form-group"> 
      <button type="submit" class="btn btn-dark" value="Reservar" id="button">Reservar</button>
  </div>     
  
</form>

  `

  formulario()

});



const btnContador = e =>{
  if(e.target.classList.contains('btn-info')){
    reservado[e.target.dataset.id]
    const viaje = reservado[e.target.dataset.id]
    viaje.cantidad = reservado[e.target.dataset.id].cantidad +1
    reservado[e.target.dataset.id] = {...viaje}
    pintarCarrito()
  }

  if(e.target.classList.contains('btn-danger')){    
    const viaje = reservado[e.target.dataset.id]
    viaje.cantidad = reservado[e.target.dataset.id].cantidad - 1
    if (viaje.cantidad === 0){
      delete reservado[e.target.dataset.id]
      
      
    }    
    pintarCarrito()
  }

  e.stopPropagation()
}





const formulario = () => {
  const btn = document.getElementById('button');  
  let reservaForm = document.getElementById("formulario-contacto");
      reservaForm.addEventListener("submit", (evento) => {
      evento.preventDefault() 
      console.dir(evento.target);
      btn.value = 'Enviando...';
      Swal.fire ({
        title: '¿Esta seguro que los datos son correctos?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, seguro',        
      }).then((result) =>{
        if(result.isConfirmed){
      let nombre = evento.target[0].value
      let apellido = evento.target[1].value
      let mail = evento.target[2].value
      let telefono = evento.target [3].value
      let pasaporte = evento.target [4].value
      let cliente = new Cliente(nombre, apellido, mail, telefono, pasaporte, reservado)
      reservaTotal.push(cliente)
      console.log(reservaTotal)
      //reservaTotal.push(reservado)
      api();
      sendEmail();
      localStorage.setItem('reservaTotal', JSON.stringify(reservaTotal))
      reservaForm.reset();
      Swal.fire ({
        title:'RESERVADO',
        icon: 'success',
        text:'La reserva fue confirmada'
      })
      btn.value = 'Reserva Enviada';
      alert('Enviado!');
        } else{
            Swal.fire ({
                title:'CANCELADO',
                icon: 'success',
                text:'La reserva no fue confirmada'
              }) 
        }

      })
     })
      
  }


function api(){
  
  fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify(reservado),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => response.json())
    .then((data) => console.log(data));

}


function sendEmail() {
  const btn = document.getElementById('button');

  document.getElementById('formulario-contacto')
   .addEventListener('submit', function(event) {
     event.preventDefault();
  
     btn.value = 'Sending...';
  
     const serviceID = 'default_service';
     const templateID = 'template_ajj8k2n';
  
     emailjs.sendForm(serviceID, templateID, this)
      .then(() => {
        btn.value = 'Send Email';
        alert('Sent!');
      }, (err) => {
        btn.value = 'Send Email';
        alert(JSON.stringify(err));
      });
  });
}





// buscador

const files = document.querySelector('#file');
const search = document.querySelector('#search');
const resultado = document.querySelector('#resultado');

const filtrar = () => {
  resultado.innerHTML = ` `
  const texto = files.value;
  for(let reservas of reservaTotal){
  
    let apellido = reservas.apellido;  
    console.log(texto) 
    console.log(apellido.indexOf(texto)) 

    if(apellido.indexOf(texto) !== -1 &&  texto.length > 0){
      
      resultado.innerHTML = `
      <div class="card">
            <div class="card-body">
                <h5 class="card-title">${reservas.apellido} ${reservas.nombre}</h5>
                <p class="card-text"> Telefono ${reservas.telefono}</p>
                <p class="card-text"> PP ${reservas.mail}</p>
                <p class="card-text">Email ${reservas.pasaporte}</p>   
                 </div>
            </div>

      `
        }
        else {
          resultado.innerHTML = ` 
          <div class="card">
          <div class="card-body">
              <h5 class="card-title">Reserva no encontrada</h5> 
            </div>
          </div>
          `
        }
  }
}


search.addEventListener('click', filtrar)


