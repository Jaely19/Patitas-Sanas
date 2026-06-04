-- 1. Tabla de personal (Para el login y auditoría de quién atendió a quién)
CREATE TABLE veterinarios (
    id_veterinario INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    especialidad VARCHAR(100),
    telefono VARCHAR(15),
    email VARCHAR(100) UNIQUE NOT NULL,
    contrasena_hash VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de clientes (Los dueños)
CREATE TABLE clientes (
    id_cliente INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    email VARCHAR(100),
    direccion TEXT,
    fecha_registro TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de mascotas
CREATE TABLE mascotas (
    id_mascota INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_cliente INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL, -- ej. Perro, Gato, Ave
    raza VARCHAR(100),
    fecha_nacimiento DATE,
    sexo VARCHAR(10),
    color VARCHAR(50),
    CONSTRAINT fk_cliente
        FOREIGN KEY(id_cliente) 
        REFERENCES clientes(id_cliente)
        ON DELETE CASCADE -- Si se borra al cliente, se borran sus mascotas
);

-- 4. Tabla de citas (Agenda)
CREATE TABLE citas (
    id_cita INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_mascota INT NOT NULL,
    id_veterinario INT NOT NULL,
    fecha_hora TIMESTAMPTZ NOT NULL,
    motivo TEXT NOT NULL,
    estado VARCHAR(20) DEFAULT 'Pendiente', -- Pendiente, Completada, Cancelada
    CONSTRAINT fk_mascota_cita
        FOREIGN KEY(id_mascota) 
        REFERENCES mascotas(id_mascota)
        ON DELETE CASCADE,
    CONSTRAINT fk_veterinario_cita
        FOREIGN KEY(id_veterinario) 
        REFERENCES veterinarios(id_veterinario)
        ON DELETE SET NULL -- Si el vet se va de la clínica, la cita no se borra
);

-- 5. Tabla de historial médico (El expediente clínico)
CREATE TABLE historial_medico (
    id_historial INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_mascota INT NOT NULL,
    id_veterinario INT NOT NULL,
    fecha_consulta TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    peso_kg DECIMAL(5,2),
    temperatura_c DECIMAL(4,2),
    sintomas TEXT,
    diagnostico TEXT NOT NULL,
    tratamiento TEXT,
    notas_adicionales TEXT,
    CONSTRAINT fk_mascota_historial
        FOREIGN KEY(id_mascota) 
        REFERENCES mascotas(id_mascota)
        ON DELETE CASCADE,
    CONSTRAINT fk_veterinario_historial
        FOREIGN KEY(id_veterinario) 
        REFERENCES veterinarios(id_veterinario)
        ON DELETE SET NULL
);