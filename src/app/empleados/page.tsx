"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {


 

  // =========================================
  // EMPLEADOS
  // =========================================

  const [empleados, setEmpleados] = useState([]);

  // =========================================
  // BUSCADOR
  // =========================================

  const [busqueda, setBusqueda] = useState("");

  // =========================================
  // CATALOGOS
  // =========================================

  const [departamentos] = useState([
    { id: 1, nombre: "COCINA" },
    { id: 2, nombre: "MESAS" },
    { id: 3, nombre: "REPARTO" },
    { id: 4, nombre: "ADMINISTRATIVO" },
    { id: 5, nombre: "PUNTOS DE VENTA" },
    { id: 6, nombre: "GENERAL" },
  ]);

  const [puestos] = useState([
    { id: 1, nombre: "AUXILIAR GENERAL" },
    { id: 2, nombre: "AUXILIAR MARKETING" },
    { id: 3, nombre: "AUXILIAR OP" },
    { id: 4, nombre: "AYUDANTE DE COCINA" },
    { id: 5, nombre: "CAJERO" },
    { id: 6, nombre: "CAPITAN DE MESEROS" },
    { id: 7, nombre: "COCINERO" },
    { id: 8, nombre: "GERENTE GENERAL" },
    { id: 9, nombre: "MESERO" },
    { id: 10, nombre: "REPARTIDOR" },
    { id: 11, nombre: "RUNNER" },
    { id: 12, nombre: "VENDEDOR" },
    { id: 13, nombre: "SUPERVISOR DE TURNO" },
  ]);

  // =========================================
  // MODO EDICION
  // =========================================

  const [modoEdicion, setModoEdicion] = useState(false);

  const [empleadoEditando, setEmpleadoEditando] =
    useState<number | null>(null);

  // =========================================
  // FORMULARIO
  // =========================================

  const [formulario, setFormulario] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    telefono: "",
    curp: "",
    direccion: "",
    fecha_nacimiento: "",
    contacto_emerencia: "",
    fecha_ingreso: "",
    departamento_id: "",
    puesto_id: "",
    tipo_contrato: "",
    fecha_vigencia: "",
    nacionalidad: "",
    sexo: "",
    activo: true,
    Pago_hora: "",
    hora_programada_entrada: "",
    Tipo_Pago: "",
    Pago_diario: "",
  });

  // =========================================
  // CARGA INICIAL
  // =========================================

  useEffect(() => {
    obtenerEmpleados();
  }, []);

  // =========================================
  // INPUTS
  // =========================================

  function manejarCambio(e: any) {

    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });

  }

  // =========================================
  // OBTENER EMPLEADOS
  // =========================================

  async function obtenerEmpleados() {

    try {

      const response = await api.get("/empleados");

      setEmpleados(response.data);

    } catch (error) {

      console.log(error);

    }

  }

  // =========================================
  // GUARDAR EMPLEADO
  // =========================================

  async function guardarEmpleado() {

    try {

      // =========================================
      // UPDATE
      // =========================================

      if (modoEdicion && empleadoEditando) {

        await api.put(
          `/empleados/${empleadoEditando}`,
          formulario
        );

        alert("Empleado actualizado correctamente");

      }

      // =========================================
      // CREATE
      // =========================================

      else {

        await api.post(
          "/empleados",
          formulario
        );

        alert("Empleado creado correctamente");

      }

      // =========================================
      // RECARGAR TABLA
      // =========================================

      await obtenerEmpleados();

      // =========================================
      // LIMPIAR FORMULARIO
      // =========================================

      limpiarFormulario();

      // =========================================
      // SCROLL ARRIBA
      // =========================================

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    } catch (error) {

      console.log(error);

      alert("Error al guardar empleado");

    }

  }

  // =========================================
  // LIMPIAR FORMULARIO
  // =========================================

  function limpiarFormulario() {

    setFormulario({
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      telefono: "",
      curp: "",
      direccion: "",
      fecha_nacimiento: "",
      contacto_emerencia: "",
      fecha_ingreso: "",
      departamento_id: "",
      puesto_id: "",
      tipo_contrato: "",
      fecha_vigencia: "",
      nacionalidad: "",
      sexo: "",
      activo: true,
      Pago_hora: "",
      hora_programada_entrada: "",
      Tipo_Pago: "",
      Pago_diario: "",
    });

    setModoEdicion(false);

    setEmpleadoEditando(null);

  }

  // =========================================
  // EDITAR EMPLEADO
  // =========================================

  function editarEmpleado(empleado: any) {

    setModoEdicion(true);

    setEmpleadoEditando(empleado.id_empleado);

    setFormulario({

      nombre:
        empleado.nombre || "",

      apellido_paterno:
        empleado.apellido_paterno || "",

      apellido_materno:
        empleado.apellido_materno || "",

      telefono:
        empleado.telefono || "",

      curp:
        empleado.curp || "",

      direccion:
        empleado.direccion || "",

      nacionalidad:
        empleado.nacionalidad || "",

      contacto_emerencia:
        empleado.contacto_emerencia || "",

      fecha_nacimiento:
        empleado.fecha_nacimiento
          ? empleado.fecha_nacimiento.split("T")[0]
          : "",

      fecha_ingreso:
        empleado.fecha_ingreso
          ? empleado.fecha_ingreso.split("T")[0]
          : "",

      fecha_vigencia:
        empleado.fecha_vigencia
          ? empleado.fecha_vigencia.split("T")[0]
          : "",

      departamento_id:
        empleado.departamento_id
          ? String(empleado.departamento_id)
          : "",

      puesto_id:
        empleado.puesto_id
          ? String(empleado.puesto_id)
          : "",

      tipo_contrato:
        empleado.tipo_contrato
          ? empleado.tipo_contrato.toUpperCase()
          : "",

      sexo:
        empleado.sexo
          ? empleado.sexo.toUpperCase()
          : "",

      activo:
        Boolean(empleado.activo),

      Tipo_Pago:
        empleado.Tipo_Pago
          ? empleado.Tipo_Pago.toUpperCase()
          : "",

      Pago_hora:
        empleado.Pago_hora
          ? String(empleado.Pago_hora)
          : "",

      Pago_diario:
        empleado.Pago_diario
          ? String(empleado.Pago_diario)
          : "",

      hora_programada_entrada:
        empleado.hora_programada_entrada || "",

    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  }

  // =========================================
  // DESACTIVAR EMPLEADO
  // =========================================

  async function eliminarEmpleado(id: number) {

    const confirmar = confirm(
      "¿Seguro que deseas desactivar este empleado?"
    );

    if (!confirmar) return;

    try {

      await api.put(`/empleados/${id}`, {
        activo: false,
      });

      alert("Empleado desactivado correctamente");

      await obtenerEmpleados();

    } catch (error) {

      console.log(error);

      alert("Error desactivando empleado");

    }

  }

  // =========================================
  // RENDER
  // =========================================

  return (

    <main className="min-h-screen bg-[#F5F6F8] p-6">

      <div className="max-w-[1600px] mx-auto">

        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <div className="mb-6">

          <h1 className="text-4xl font-bold text-[#111827]">
            Empleados
          </h1>

          <p className="text-[#6B7280] mt-2">
            Gestión de empleados
          </p>

        </div>

        {/* ========================================= */}
        {/* FORMULARIO */}
        {/* ========================================= */}

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 mb-6">

          <div className="mb-8">

            <h2 className="text-2xl font-semibold text-[#111827]">

              {modoEdicion
                ? "Editar Empleado"
                : "Nuevo Empleado"}

            </h2>

          </div>

          {/* ========================================= */}
          {/* INFORMACION PERSONAL */}
          {/* ========================================= */}

          <div className="mb-10">

            <h3 className="text-lg font-semibold text-[#111827] mb-6">
              Información Personal
            </h3>

            <div className="grid grid-cols-4 gap-6">

              <div>
                <label className="block text-sm font-medium mb-2">
                  Nombre(s)
                </label>

                <Input
                  name="nombre"
                  value={formulario.nombre}
                  onChange={manejarCambio}
                  className="h-12 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Apellido Paterno
                </label>

                <Input
                  name="apellido_paterno"
                  value={formulario.apellido_paterno}
                  onChange={manejarCambio}
                  className="h-12 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Apellido Materno
                </label>

                <Input
                  name="apellido_materno"
                  value={formulario.apellido_materno}
                  onChange={manejarCambio}
                  className="h-12 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Sexo
                </label>

                <select
                  name="sexo"
                  value={formulario.sexo}
                  onChange={manejarCambio}
                  className="w-full h-12 rounded-xl border border-[#D1D5DB] px-3"
                >
                  <option value="">Selecciona</option>
                  <option value="HOMBRE">Hombre</option>
                  <option value="MUJER">Mujer</option>
                </select>

              </div>

            </div>

          </div>

          {/* ========================================= */}
          {/* INFORMACION LABORAL */}
          {/* ========================================= */}

          <div className="mb-10">

            <h3 className="text-lg font-semibold text-[#111827] mb-6">
              Información Laboral
            </h3>

            <div className="grid grid-cols-4 gap-6">

              <div>
                <label className="block text-sm font-medium mb-2">
                  Departamento
                </label>

                <select
                  name="departamento_id"
                  value={formulario.departamento_id}
                  onChange={manejarCambio}
                  className="w-full h-12 rounded-xl border border-[#D1D5DB] px-3"
                >
                  <option value="">Selecciona</option>

                  {departamentos.map((departamento: any) => (
                    <option
                      key={departamento.id}
                      value={departamento.id}
                    >
                      {departamento.nombre}
                    </option>
                  ))}

                </select>

              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Puesto
                </label>

                <select
                  name="puesto_id"
                  value={formulario.puesto_id}
                  onChange={manejarCambio}
                  className="w-full h-12 rounded-xl border border-[#D1D5DB] px-3"
                >
                  <option value="">Selecciona</option>

                  {puestos.map((puesto: any) => (
                    <option
                      key={puesto.id}
                      value={puesto.id}
                    >
                      {puesto.nombre}
                    </option>
                  ))}

                </select>

              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tipo Contrato
                </label>

                <select
                  name="tipo_contrato"
                  value={formulario.tipo_contrato}
                  onChange={manejarCambio}
                  className="w-full h-12 rounded-xl border border-[#D1D5DB] px-3"
                >
                  <option value="">Selecciona</option>
                  <option value="INDEFINIDO">Indefinido</option>
                  <option value="TEMPORAL">Temporal</option>
                </select>

              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Status
                </label>

                <select
                  name="activo"
                  value={formulario.activo ? "true" : "false"}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      activo: e.target.value === "true",
                    })
                  }
                  className="w-full h-12 rounded-xl border border-[#D1D5DB] px-3"
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>

              </div>

            </div>

          </div>

          {/* ========================================= */}
          {/* INFORMACION PAGO */}
          {/* ========================================= */}

          <div className="mb-10">

            <h3 className="text-lg font-semibold text-[#111827] mb-6">
              Información de Pago
            </h3>

            <div className="grid grid-cols-4 gap-6">

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tipo Pago
                </label>

                <select
                  name="Tipo_Pago"
                  value={formulario.Tipo_Pago}
                  onChange={manejarCambio}
                  className="w-full h-12 rounded-xl border border-[#D1D5DB] px-3"
                >
                  <option value="">Selecciona</option>
                  <option value="DIARIO">Diario</option>
                  <option value="POR_HORA">Por Hora</option>
                </select>

              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Pago Hora
                </label>

                <Input
                  type="number"
                  name="Pago_hora"
                  value={formulario.Pago_hora}
                  onChange={manejarCambio}
                  className="h-12 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Pago Diario
                </label>

                <Input
                  type="number"
                  name="Pago_diario"
                  value={formulario.Pago_diario}
                  onChange={manejarCambio}
                  className="h-12 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Hora Entrada
                </label>

                <Input
                  type="time"
                  name="hora_programada_entrada"
                  value={formulario.hora_programada_entrada}
                  onChange={manejarCambio}
                  className="h-12 rounded-xl"
                />
              </div>

            </div>

          </div>

          {/* BOTONES */}
          <div className="flex justify-end gap-4">

            <Button
              variant="outline"
              onClick={limpiarFormulario}
              className="h-12 px-6 rounded-xl"
            >
              Cancelar
            </Button>

            <Button
              onClick={guardarEmpleado}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] h-12 px-6 rounded-xl"
            >
              {modoEdicion
                ? "Actualizar Empleado"
                : "Guardar Empleado"}
            </Button>

          </div>

        </div>

        {/* ========================================= */}
        {/* BUSCADOR */}
        {/* ========================================= */}

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 mb-6">

          <Input
            placeholder="Buscar empleado por nombre, apellido o ID..."
            value={busqueda}
            onChange={(e) =>
              setBusqueda(e.target.value)
            }
            className="h-12 rounded-xl"
          />

        </div>

        {/* ========================================= */}
        {/* TABLA EMPLEADOS */}
        {/* ========================================= */}

        <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">

          {/* HEADER */}
          <div className="grid grid-cols-6 gap-4 px-6 py-4 bg-[#F9FAFB] border-b border-[#E5E7EB]">

            <div className="font-semibold">
              ID
            </div>

            <div className="font-semibold">
              Nombre
            </div>

            <div className="font-semibold">
              Puesto
            </div>

            <div className="font-semibold">
              Departamento
            </div>

            <div className="font-semibold">
              Status
            </div>

            <div className="font-semibold text-right">
              Acciones
            </div>

          </div>

          {/* FILAS */}
          {empleados
            .filter((empleado: any) => {

              const texto = busqueda.toLowerCase();

              return (

                

                empleado.nombre
                  ?.toLowerCase()
                  .includes(texto)

                ||

                empleado.apellido_paterno
                  ?.toLowerCase()
                  .includes(texto)

                ||

                empleado.apellido_materno
                  ?.toLowerCase()
                  .includes(texto)

                ||

                String(empleado.id_empleado)
                  .includes(texto)

              );

            })
            .map((empleado: any) => (

              <div
                key={empleado.id_empleado}
                className="grid grid-cols-6 gap-4 px-6 py-5 border-b border-[#F3F4F6] items-center"
              >

                <div>
                  {empleado.id_empleado}
                </div>

                <div className="font-medium">
                  {empleado.nombre} {empleado.apellido_paterno}
                </div>

                <div>

                  {
                    puestos.find(
                      (puesto: any) =>
                        puesto.id === Number(empleado.puesto_id)
                    )?.nombre || "Sin puesto"
                  }

                </div>

                <div>

                  {
                    departamentos.find(
                      (departamento: any) =>
                        departamento.id === Number(empleado.departamento_id)
                    )?.nombre || "Sin departamento"
                  }

                </div>

                <div>

                  {empleado.activo ? (

                    <span className="bg-[#DCFCE7] text-[#15803D] text-sm px-3 py-1 rounded-full">
                      Activo
                    </span>

                  ) : (

                    <span className="bg-[#FEE2E2] text-[#DC2626] text-sm px-3 py-1 rounded-full">
                      Inactivo
                    </span>

                  )}

                </div>

                <div className="flex justify-end gap-4">

                  <button
                    onClick={() => editarEmpleado(empleado)}
                    className="hover:text-blue-600"
                  >
                    ✏️
                  </button>

                

                </div>

              </div>

            ))}

        </div>

      </div>

    </main>

  );

}