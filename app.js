const tableBody = document.getElementById('table-body');
const gradesForm = document.getElementById('grade-form');
const submitBtn = document.getElementById('submit-btn');
const inputNombre = document.getElementById('nombre');
const inputApellido = document.getElementById('apellido');
const inputMatricula = document.getElementById('matricula');
const inputNota = document.getElementById('nota');
const contenedorPromedio = document.getElementById('promedio-notas');

window.onload = () => {
  load();
  crearRegistro();
};

class Estudiante {
  constructor({ nombre, apellido, matricula, nota }) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.matricula = matricula;
    this.nota = nota;
  }
}

let estudiantes = [];

const nuevoEstudiante = {
  nombre: '',
  apellido: '',
  matricula: 0,
  nota: 0,
};

const save = () => {
  localStorage.setItem('estudiantes', JSON.stringify(estudiantes));
};

const load = () => {
  if (localStorage.getItem('estudiantes')) {
    estudiantes = JSON.parse(localStorage.getItem('estudiantes'));
  }
};

const manejarCambio = (event) => {
  const name = event.target.name;
  const value = event.target.value;
  if (name === 'matricula' || name === 'nota') {
    nuevoEstudiante[name] = Number(value);
    return;
  }
  nuevoEstudiante[name] = value;
};

const inputEventListener = (input) => {
  input.addEventListener('keyup', (event) => {
    manejarCambio(event);
  });
};

inputEventListener(inputNombre);
inputEventListener(inputApellido);
inputEventListener(inputMatricula);
inputEventListener(inputNota);

const crearRegistro = () => {
  // tablas
  tableBody.innerHTML = '';
  for (const { matricula, nombre, apellido, nota } of estudiantes) {
    const tableRow = document.createElement('tr');

    const tableData = (data) => {
      const td = document.createElement('td');
      td.innerText = data;
      return td;
    };

    const tableDataBtn = (textoBoton1, textoBoton2) => {
      const td = document.createElement('td');

      td.innerHTML = `<button onclick="borrarRegistro(${matricula})"   class="btn">${textoBoton1}</button>
      <button onclick="editarRegistro(${matricula})" class="btn">${textoBoton2}</button>`;

      return td;
    };

    const tableDataMatricula = tableData(matricula);
    const tableDataNombre = tableData(nombre);
    const tableDataApellido = tableData(apellido);
    const tableDataNota = tableData(nota);
    const botonesFunciones = tableDataBtn('borrar', 'editar');

    tableRow.append(
      tableDataMatricula,
      tableDataNombre,
      tableDataApellido,
      tableDataNota,
      botonesFunciones
    );

    tableBody.innerHTML += tableRow.innerHTML;
  }

  // promedio
  if (estudiantes.length > 0) {
    contenedorPromedio.innerHTML = '';
    const promedio = document.createElement('h4');
    promedio.classList.add('promedio');

    promedio.innerHTML = `Promedio <span class="notas">${(
      estudiantes.reduce((promedio, estudiante) => {
        const { nota } = estudiante;
        promedio += nota;
        return promedio;
      }, 0) / estudiantes.length
    ).toFixed(0)}</span>`;

    contenedorPromedio.appendChild(promedio);
  }
};

const borrarRegistro = (matricula) => {
  estudiantes = estudiantes.filter(
    (estudiante) => estudiante.matricula !== matricula
  );
  crearRegistro();
  save();
};

const editarRegistro = (matricula) => {
  const estudiante = estudiantes.filter(
    (estudiante) => estudiante.matricula === matricula
  );

  const { nombre, apellido, nota } = estudiante[0];

  inputNombre.value = nombre;
  inputMatricula.value = matricula;
  inputApellido.value = apellido;
  inputNota.value = nota;
  nuevoEstudiante.nombre = nombre;
  nuevoEstudiante.matricula = matricula;
  nuevoEstudiante.apellido = apellido;
  nuevoEstudiante.nota = nota;

  borrarRegistro(matricula);
};

const submitEventListener = (form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    estudiantes.push(new Estudiante(nuevoEstudiante));
    inputNombre.value = '';
    inputApellido.value = '';
    inputMatricula.value = '';
    inputNota.value = '';
    crearRegistro();
    save();
  });
};

submitEventListener(gradesForm);
submitEventListener(submitBtn);
