"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";

const DIAS_SEMANA = [
  { id: 1, nombre: "Lunes" },
  { id: 2, nombre: "Martes" },
  { id: 3, nombre: "Miércoles" },
  { id: 4, nombre: "Jueves" },
  { id: 5, nombre: "Viernes" },
  { id: 6, nombre: "Sábado" },
  { id: 7, nombre: "Domingo" },
];

export default function DescansosPage() {

  const [empleados, setEmpleados]       = useState([]);
  const [descansos, setDescansos]       = useState([]);
  const [empleadoSel, setEmpleadoSel]   = useState<any>(null);
  const [diaSel, setDiaSel]             = useState("");
  const [cargando, setCargando]         = useState(false);

  // =========================================
  // CARGA INICIAL
  // =========================================

  useEffect(() => {
    obtenerEmpleados();
  }, []);

  // =========================================
  // OBTENER EMPLEADOS
  // =========================================

  async function obtenerEmpleados() {
    try {
      const res = await api.get("/empleados");
      setEmpleados(res.data.filter((e: any) => e.activo));
    } catch (error) {
      console.error(error);
    }
  }

  // =========================================
  // SELECCIONAR EMPLEADO → CARGAR DESCANSOS
  // =========================================

  async function seleccionarEmpleado(empleado: any) {
    setEmpleadoSel(empleado);
    setDiaSel("");
    try {
      const res = await api.get(`/descansos/${empleado.id_empleado}`);
      setDescansos(res.data);
    } catch (error) {
      console.error(error);
      setDescansos([]);
    }
  }

  // =========================================
  // ASIGNAR DÍA DE DESCANSO
  // =========================================

  async function asignarDescanso() {
    if (!empleadoSel || !diaSel) {
      alert("Selecciona un empleado y un día");
      return;
    }

    setCargando(true);
    try {
      await api.post("/descansos", {
        id_empleado: empleadoSel.id_empleado,
        dia_semana:  parseInt(diaSel),
      });
      const res = await api.get(`/descansos/${empleadoSel.id_empleado}`);
      setDescansos(res.data);
      setDiaSel("");
    } catch (error: any) {
      alert(error?.response?.data?.error || "Error asignando descanso");
    } finally {
      setCargando(false);
    }
  }

  // =========================================
  // ELIMINAR DÍA DE DESCANSO
  // =========================================

  async function eliminarDescanso(id_descanso: number) {
    const confirmar = confirm("¿Quitar este día de descanso?");
    if (!confirmar) return;

    try {
      await api.delete(`/descansos/${id_descanso}`);
      const res = await api.get(`/descansos/${empleadoSel.id_empleado}`);
      setDescansos(res.data);
    } catch (error) {
      alert("Error eliminando descanso");
    }
  }

  // =========================================
  // RENDER
  // =========================================

  return (
    <main className="min-h-screen bg-[#F5F6F8] p-6">
      <div className="max-w-[1600px] mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-[#111827]">
            Días de Descanso
          </h1>
          <p className="text-[#6B7280] mt-2">
            Asigna los días de descanso por empleado
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">

          {/* =========================================
              COLUMNA IZQUIERDA — LISTA DE EMPLEADOS
          ========================================= */}

          <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">

            <div className="px-6 py-4 bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <h2 className="text-lg font-semibold text-[#111827]">
                Empleados
              </h2>
            </div>

            {empleados.map((empleado: any) => (
              <div
                key={empleado.id_empleado}
                onClick={() => seleccionarEmpleado(empleado)}
                className={`px-6 py-4 border-b border-[#F3F4F6] cursor-pointer flex justify-between items-center transition-colors ${
                  empleadoSel?.id_empleado === empleado.id_empleado
                    ? "bg-[#EFF6FF] border-l-4 border-l-[#2563EB]"
                    : "hover:bg-[#F9FAFB]"
                }`}
              >
                <div>
                  <p className="font-medium text-[#111827]">
                    {empleado.nombre} {empleado.apellido_paterno}
                  </p>
                  <p className="text-sm text-[#6B7280]">
                    ID: {empleado.id_empleado}
                  </p>
                </div>
                <span className="text-[#9CA3AF] text-sm">→</span>
              </div>
            ))}

          </div>

          {/* =========================================
              COLUMNA DERECHA — DESCANSOS DEL EMPLEADO
          ========================================= */}

          <div className="flex flex-col gap-6">

            {/* ASIGNAR DESCANSO */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">

              <h2 className="text-lg font-semibold text-[#111827] mb-6">
                {empleadoSel
                  ? `Descansos de ${empleadoSel.nombre} ${empleadoSel.apellido_paterno}`
                  : "Selecciona un empleado"}
              </h2>

              {empleadoSel && (
                <div className="flex gap-4">
                  <select
                    value={diaSel}
                    onChange={(e) => setDiaSel(e.target.value)}
                    className="flex-1 h-12 rounded-xl border border-[#D1D5DB] px-3"
                  >
                    <option value="">Selecciona un día</option>
                    {DIAS_SEMANA.map((dia) => (
                      <option key={dia.id} value={dia.id}>
                        {dia.nombre}
                      </option>
                    ))}
                  </select>

                  <Button
                    onClick={asignarDescanso}
                    disabled={cargando}
                    className="bg-[#2563EB] hover:bg-[#1D4ED8] h-12 px-6 rounded-xl"
                  >
                    {cargando ? "Guardando..." : "Asignar"}
                  </Button>
                </div>
              )}

            </div>

            {/* TABLA DE DESCANSOS ASIGNADOS */}
            {empleadoSel && (
              <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">

                <div className="px-6 py-4 bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  <h3 className="font-semibold text-[#111827]">
                    Días asignados
                  </h3>
                </div>

                {descansos.length === 0 ? (
                  <div className="px-6 py-8 text-center text-[#6B7280]">
                    Sin días de descanso asignados
                  </div>
                ) : (
                  descansos.map((descanso: any) => (
                    <div
                      key={descanso.id_descansos}
                      className="px-6 py-4 border-b border-[#F3F4F6] flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">😴</span>
                        <span className="font-medium text-[#111827]">
                          {DIAS_SEMANA.find(d => d.id === descanso.dia_semana)?.nombre || "Desconocido"}
                        </span>
                      </div>

                      <button
                        onClick={() => eliminarDescanso(descanso.id_descansos)}
                        className="text-[#DC2626] hover:text-[#B91C1C] text-sm font-medium"
                      >
                        Quitar
                      </button>
                    </div>
                  ))
                )}

              </div>
            )}

          </div>

        </div>

      </div>
    </main>
  );
}