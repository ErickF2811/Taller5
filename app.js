// app.js

// Configura AWS S3
AWS.config.update({
    accessKeyId: '', 
    secretAccessKey: '',
    sessionToken: ''
    ,region: 'us-east-1'
});

const s3 = new AWS.S3();
const bucketName = 'imagenes-flores-202106704';



let lastUploadedFileUrl = '';

// Función para subir archivos
document.getElementById('upload-button').addEventListener('click', () => {
    const files = document.getElementById('file-upload').files;
    if (files.length === 0) {
        alert('Por favor, seleccione al menos un archivo.');
        return;
    }
    const file = files[0]; // Tomar solo el primer archivo para simplificar
    const params = {
        Bucket: bucketName,
        Key: file.name,
        Body: file,
        ACL: 'public-read' // Para hacer las imágenes públicamente accesibles
    };

    s3.upload(params, (err, data) => {
        if (err) {
            console.error('Error subiendo el archivo:', err);
        } else {
            console.log('Archivo subido con éxito:', data.Location);
            lastUploadedFileUrl = data.Location;
        }
    });
});

// Función para registrar la foto en la base de datos
document.getElementById('photo-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const cedula = document.getElementById('cedula').value;
    const nombre = document.getElementById('nombre').value;

    if (!lastUploadedFileUrl) {
        alert('Por favor, suba una foto primero.');
        return;
    }

    const data = {
        TableName: "TableName",
        Item: {
            Item: cedula,
            nombre: nombre,
            phtoURL: lastUploadedFileUrl
        }
    };

    fetch('https://srinpa4kyc.execute-api.us-east-1.amazonaws.com/default/book', {
        method: 'POST',
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Registro exitoso:', data);
    })
    .catch((error) => {
        console.error('Error registrando la foto:', error);
    });
});

// Función para obtener los datos registrados
document.getElementById('get-button').addEventListener('click', () => {
    fetch('https://srinpa4kyc.execute-api.us-east-1.amazonaws.com/default/book?TableName=TableName', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('response-output').textContent = JSON.stringify(data, null, 2);
    })
    .catch((error) => {
        console.error('Error obteniendo los datos:', error);
    });
});