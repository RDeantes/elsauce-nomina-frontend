"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";

export default function NominasPage() {

  // =========================================
  // ESTADOS
  // =========================================

  const [nominas, setNominas] = useState<any[]>([]);

  // Modal de descuento
  const [modalAbierto, setModalAbierto]       = useState(false);
  const [empleadoModal, setEmpleadoModal]     = useState<any>(null);
  const [concepto, setConcepto]               = useState("");
  const [conceptoCustom, setConceptoCustom]   = useState("");
  const [monto, setMonto]                     = useState("");
  const [guardando, setGuardando]             = useState(false);

  // =========================================
  // OBTENER NOMINAS ACUMULADAS
  // =========================================

  async function obtenerNominas() {
    try {
      const empleadosResponse = await api.get("/empleados");
      const empleados = empleadosResponse.data;

      const resultados = await Promise.all(
        empleados.map(async (emp: any) => {
          try {
            const acumuladoResponse = await api.get(`/nominas/acumulado/${emp.id_empleado}`);
            return { empleado: emp, acumulado: acumuladoResponse.data };
          } catch {
            return null;
          }
        })
      );

      const pendientes = resultados.filter(
        (r: any) => r && Number(r.acumulado.total_acumulado) > 0
      );

      setNominas(pendientes);
    } catch (error) {
      console.log(error);
    }
  }

  // =========================================
  // CARGAR AL INICIAR
  // =========================================

  useEffect(() => {
    obtenerNominas();
  }, []);

  // =========================================
  // ABRIR MODAL DE DESCUENTO
  // =========================================

  function abrirModal(empleado: any) {
    setEmpleadoModal(empleado);
    setConcepto("");
    setConceptoCustom("");
    setMonto("");
    setModalAbierto(true);
  }

  function cerrarModal() {
    setModalAbierto(false);
    setEmpleadoModal(null);
  }

  // =========================================
  // APLICAR DESCUENTO
  // =========================================

  async function aplicarDescuento() {
    const conceptoFinal = concepto === "OTRO" ? conceptoCustom : concepto;

    if (!conceptoFinal || !monto) {
      alert("Completa el concepto y el monto");
      return;
    }

    if (Number(monto) <= 0) {
      alert("El monto debe ser mayor a 0");
      return;
    }

    setGuardando(true);
    try {
      // Usamos el último recibo pendiente para aplicar la deducción
      const acumulado = await api.get(`/nominas/acumulado/${empleadoModal.id_empleado}`);
      const detalle   = acumulado.data.detalle;

      if (!detalle || detalle.length === 0) {
        alert("No hay nómina pendiente para este empleado");
        return;
      }

      // Aplicar al recibo más reciente
      const ultimoRecibo = detalle[detalle.length - 1];

      await api.post("/nominas/incidencias", {
        id_empleado: empleadoModal.id_empleado,
        fecha:       ultimoRecibo.fecha_inicio.split("T")[0],
        tipo:        "DEDUCCION",
        concepto:    conceptoFinal,
        monto:       Number(monto),
      });

      alert(`Descuento de $${monto} por "${conceptoFinal}" aplicado correctamente`);
      cerrarModal();
      obtenerNominas();
    } catch (error: any) {
      alert(error?.response?.data?.error || "Error aplicando descuento");
    } finally {
      setGuardando(false);
    }
  }

  // =========================================
  // PAGAR NOMINA
  // =========================================

  async function pagarNomina(id_empleado: number) {
    try {
      const response = await api.post(
        `/nominas/imprimir-y-pagar/${id_empleado}`,
        {},
        { responseType: "blob" }
      );

      const url  = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href  = url;
      link.setAttribute("download", `Recibo_Pago_${id_empleado}.docx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert("¡Pago liquidado y recibo descargado!");
      obtenerNominas();
    } catch (error) {
      console.error(error);
      alert("Error al procesar el pago");
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
            Nóminas Pendientes
          </h1>
          <p className="text-[#6B7280] mt-2">
            Empleados listos para pago
          </p>
        </div>

        {/* TABLA */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
          <table className="w-full">

            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold">Empleado</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Recibos Pendientes</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Total Acumulado</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {nominas.map((item: any) => (
                <tr key={item.empleado.id_empleado} className="border-b border-[#F3F4F6]">

                  {/* EMPLEADO */}
                  <td className="px-6 py-4 text-sm font-medium">
                    {item.empleado.nombre} {item.empleado.apellido_paterno}
                  </td>

                  {/* RECIBOS */}
                  <td className="px-6 py-4 text-sm">
                    {item.acumulado.recibos_pendientes}
                  </td>

                  {/* TOTAL */}
                  <td className="px-6 py-4 text-lg font-bold text-green-600">
                    ${item.acumulado.total_acumulado}
                  </td>

                  {/* ACCIONES */}
                  <td className="px-6 py-4">
                    <div className="flex gap-3">

                      {/* BOTÓN DESCUENTO */}
                      <button
                        onClick={() => abrirModal(item.empleado)}
                        className="bg-[#FEF3C7] text-[#92400E] hover:bg-[#FDE68A] px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                      >
                        Aplicar Descuento
                      </button>

                      {/* BOTÓN PAGAR */}
                      <Button
                        onClick={() => pagarNomina(item.empleado.id_empleado)}
                        style={{
                          backgroundColor: "#2563EB",
                          color: "white",
                          padding: "10px 18px",
                          borderRadius: "12px",
                          border: "none",
                          cursor: "pointer",
                          fontWeight: "600",
                        }}
                      >
                        Realizar Pago de Nómina
                      </Button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>

      {/* =========================================
          MODAL DE DESCUENTO
      ========================================= */}

      {modalAbierto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">

            {/* HEADER MODAL */}
            <h2 className="text-xl font-bold text-[#111827] mb-1">
              Aplicar Descuento
            </h2>
            <p className="text-sm text-[#6B7280] mb-6">
              {empleadoModal?.nombre} {empleadoModal?.apellido_paterno}
            </p>

            {/* CONCEPTO */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Concepto
              </label>
              <select
                value={concepto}
                onChange={(e) => setConcepto(e.target.value)}
                className="w-full h-12 rounded-xl border border-[#D1D5DB] px-3"
              >
                <option value="">Selecciona un concepto</option>
                <option value="COMIDA">Comida</option>
                <option value="PRESTAMO">Préstamo</option>
                <option value="UNIFORME">Uniforme</option>
                <option value="OTRO">Otro...</option>
              </select>
            </div>

            {/* CONCEPTO PERSONALIZADO */}
            {concepto === "OTRO" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Especifica el concepto
                </label>
                <input
                  type="text"
                  value={conceptoCustom}
                  onChange={(e) => setConceptoCustom(e.target.value)}
                  placeholder="Ej. Rotura de equipo"
                  className="w-full h-12 rounded-xl border border-[#D1D5DB] px-3"
                />
              </div>
            )}

            {/* MONTO */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Monto a descontar
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] font-medium">$</span>
                <input
                  type="number"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  className="w-full h-12 rounded-xl border border-[#D1D5DB] pl-7 pr-3"
                />
              </div>
            </div>

            {/* BOTONES */}
            <div className="flex gap-3">
              <button
                onClick={cerrarModal}
                className="flex-1 h-12 rounded-xl border border-[#D1D5DB] text-[#374151] font-medium hover:bg-[#F9FAFB] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={aplicarDescuento}
                disabled={guardando}
                className="flex-1 h-12 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold transition-colors disabled:opacity-50"
              >
                {guardando ? "Aplicando..." : "Aplicar Descuento"}
              </button>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}