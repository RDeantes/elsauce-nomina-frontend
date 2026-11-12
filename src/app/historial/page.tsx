"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/services/api";

const POR_PAGINA = 40;

const money = (n: number) =>
  `$${Number(n || 0).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// "2026-11-09T00:00:00.000Z" -> "09/11/2026" (sin convertir zona horaria)
function fechaCorta(iso: string) {
  const [y, m, d] = String(iso).split("T")[0].split("-");
  return `${d}/${m}/${y}`;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function HistorialPage() {
  const [filas, setFilas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [visibles, setVisibles] = useState(POR_PAGINA);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/nominas/historial");
        setFilas(res.data);
      } catch (e) {
        console.error(e);
        setError("No se pudo cargar el historial");
      } finally {
        setCargando(false);
      }
    })();
  }, []);

  // Agrupa los recibos que se pagaron en una misma operación (mismo empleado y misma fecha_pago).
  // Los pagos viejos (sin fecha_pago) se muestran uno por uno.
  const pagos = useMemo(() => {
    const mapa = new Map<string, any>();
    for (const f of filas) {
      const clave = f.fecha_pago
        ? `${f.id_empleado}|${f.fecha_pago}`
        : `${f.id_empleado}|sin|${f.id_nomina}`;
      let g = mapa.get(clave);
      if (!g) {
        const e = f.empleados || {};
        let diaFiltro: string;
        if (f.fecha_pago) {
          const dt = new Date(f.fecha_pago);
          diaFiltro = `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
        } else {
          diaFiltro = String(f.fecha_fin).split("T")[0];
        }
        g = {
          clave,
          id_empleado: f.id_empleado,
          nombre: `${e.nombre || ""} ${e.apellido_paterno || ""}`.trim() || `ID ${f.id_empleado}`,
          fecha_pago: f.fecha_pago,
          diaFiltro,
          inicio: f.fecha_inicio,
          fin: f.fecha_fin,
          recibos: 0,
          bruto: 0,
          retardos: 0,
          otras_deducciones: 0,
          percepciones: 0,
          neto: 0,
        };
        mapa.set(clave, g);
      }
      g.recibos += 1;
      if (f.fecha_inicio < g.inicio) g.inicio = f.fecha_inicio;
      if (f.fecha_fin > g.fin) g.fin = f.fecha_fin;
      g.bruto += Number(f.sueldo_bruto || 0);
      g.retardos += Number(f.total_descuentos_retardo || 0);
      g.otras_deducciones += Number(f.comidas || 0) + Number(f.otras_deducciones || 0);
      g.percepciones += Number(f.bonos || 0) + Number(f.otras_percepciones || 0);
      g.neto += Number(f.total_neto || 0);
    }
    return Array.from(mapa.values());
  }, [filas]);

  const filtrados = useMemo(() => {
    const t = busqueda.trim().toLowerCase();
    return pagos.filter((p) => {
      if (t && !p.nombre.toLowerCase().includes(t) && !String(p.id_empleado).includes(t)) return false;
      if (desde && p.diaFiltro < desde) return false;
      if (hasta && p.diaFiltro > hasta) return false;
      return true;
    });
  }, [pagos, busqueda, desde, hasta]);

  const totalFiltrado = filtrados.reduce((a, p) => a + p.neto, 0);
  const lista = filtrados.slice(0, visibles);

  function fechaPagoTexto(p: any) {
    if (!p.fecha_pago) return null;
    const dt = new Date(p.fecha_pago);
    return `${pad(dt.getDate())}/${pad(dt.getMonth() + 1)}/${dt.getFullYear()} ${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
  }

  function limpiar() {
    setBusqueda("");
    setDesde("");
    setHasta("");
    setVisibles(POR_PAGINA);
  }

  return (
    <main className="min-h-screen bg-[#F5F6F8] p-4 sm:p-6">
      <div className="max-w-[1600px] mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-4xl font-bold text-[#111827]">Historial de Pagos</h1>
          <p className="text-[#6B7280] mt-2 text-sm sm:text-base">Nóminas que ya fueron pagadas</p>
        </div>

        {/* FILTROS */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            placeholder="Buscar por nombre o ID..."
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setVisibles(POR_PAGINA); }}
            className="w-full h-11 rounded-xl border border-[#D1D5DB] px-3 text-sm outline-none focus:border-[#2563EB]"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6B7280] w-12 shrink-0">Desde</span>
            <input
              type="date"
              value={desde}
              onChange={(e) => { setDesde(e.target.value); setVisibles(POR_PAGINA); }}
              className="w-full h-11 rounded-xl border border-[#D1D5DB] px-3 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6B7280] w-12 shrink-0">Hasta</span>
            <input
              type="date"
              value={hasta}
              onChange={(e) => { setHasta(e.target.value); setVisibles(POR_PAGINA); }}
              className="w-full h-11 rounded-xl border border-[#D1D5DB] px-3 text-sm"
            />
          </div>
          <button
            onClick={limpiar}
            className="h-11 rounded-xl border border-[#D1D5DB] text-[#374151] text-sm font-medium hover:bg-[#F9FAFB]"
          >
            Limpiar filtros
          </button>
        </div>

        {/* RESUMEN */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4">
            <p className="text-xs text-[#6B7280]">Pagos</p>
            <p className="text-xl sm:text-2xl font-bold text-[#111827]">{filtrados.length}</p>
          </div>
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4">
            <p className="text-xs text-[#6B7280]">Total pagado</p>
            <p className="text-xl sm:text-2xl font-bold text-green-600">{money(totalFiltrado)}</p>
          </div>
        </div>

        {cargando && <div className="text-center text-[#6B7280] py-10">Cargando...</div>}
        {error && <div className="text-center text-[#DC2626] py-10">{error}</div>}

        {!cargando && !error && (
          <>
            {/* TABLA (escritorio) */}
            <div className="hidden md:block bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  <tr>
                    <th className="text-left px-5 py-4 text-sm font-semibold">Empleado</th>
                    <th className="text-left px-5 py-4 text-sm font-semibold">Fecha de pago</th>
                    <th className="text-left px-5 py-4 text-sm font-semibold">Periodo</th>
                    <th className="text-right px-5 py-4 text-sm font-semibold">Bruto</th>
                    <th className="text-right px-5 py-4 text-sm font-semibold">Descuentos</th>
                    <th className="text-right px-5 py-4 text-sm font-semibold">Neto</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((p) => (
                    <tr key={p.clave} className="border-b border-[#F3F4F6]">
                      <td className="px-5 py-3 text-sm font-medium">
                        {p.nombre}
                        <span className="block text-xs text-[#9CA3AF]">ID {p.id_empleado}</span>
                      </td>
                      <td className="px-5 py-3 text-sm">
                        {fechaPagoTexto(p) || <span className="text-[#9CA3AF]">Fecha no registrada</span>}
                      </td>
                      <td className="px-5 py-3 text-sm">
                        {p.inicio === p.fin ? fechaCorta(p.inicio) : `${fechaCorta(p.inicio)} – ${fechaCorta(p.fin)}`}
                        {p.recibos > 1 && <span className="block text-xs text-[#9CA3AF]">{p.recibos} recibos</span>}
                      </td>
                      <td className="px-5 py-3 text-sm text-right">{money(p.bruto)}</td>
                      <td className="px-5 py-3 text-sm text-right text-[#DC2626]">
                        {money(p.retardos + p.otras_deducciones)}
                      </td>
                      <td className="px-5 py-3 text-base text-right font-bold text-green-600">{money(p.neto)}</td>
                    </tr>
                  ))}
                  {lista.length === 0 && (
                    <tr><td colSpan={6} className="px-5 py-10 text-center text-[#6B7280]">Sin pagos con esos filtros</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* TARJETAS (celular) */}
            <div className="md:hidden flex flex-col gap-3">
              {lista.map((p) => (
                <div key={p.clave} className="bg-white border border-[#E5E7EB] rounded-2xl p-4">
                  <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-[#111827] truncate">{p.nombre}</p>
                      <p className="text-xs text-[#9CA3AF]">ID {p.id_empleado}</p>
                    </div>
                    <p className="text-lg font-bold text-green-600 shrink-0">{money(p.neto)}</p>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-[#6B7280]">Fecha de pago</p>
                      <p className="text-[#111827] text-sm">{fechaPagoTexto(p) || "No registrada"}</p>
                    </div>
                    <div>
                      <p className="text-[#6B7280]">Periodo</p>
                      <p className="text-[#111827] text-sm">
                        {p.inicio === p.fin ? fechaCorta(p.inicio) : `${fechaCorta(p.inicio)} – ${fechaCorta(p.fin)}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#6B7280]">Bruto</p>
                      <p className="text-[#111827] text-sm">{money(p.bruto)}</p>
                    </div>
                    <div>
                      <p className="text-[#6B7280]">Descuentos</p>
                      <p className="text-[#DC2626] text-sm">{money(p.retardos + p.otras_deducciones)}</p>
                    </div>
                  </div>
                </div>
              ))}
              {lista.length === 0 && (
                <div className="text-center text-[#6B7280] py-10">Sin pagos con esos filtros</div>
              )}
            </div>

            {filtrados.length > visibles && (
              <div className="text-center mt-4">
                <button
                  onClick={() => setVisibles((v) => v + POR_PAGINA)}
                  className="h-11 px-6 rounded-xl border border-[#D1D5DB] bg-white text-[#374151] text-sm font-medium hover:bg-[#F9FAFB]"
                >
                  Ver más ({filtrados.length - visibles} restantes)
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </main>
  );
}
