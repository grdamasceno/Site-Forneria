"use client";

import { useState, useTransition } from "react";
import { Modal, inputCls } from "@/components/admin/ui";
import { createUser, deleteUser } from "./actions";

export type AdminUser = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
};

export default function UsuariosAdmin({ users, superAdmin }: { users: AdminUser[]; superAdmin: string }) {
  const [novo, setNovo] = useState(false);
  const [, start] = useTransition();

  const fmt = (d: string | null) => (d ? new Date(d).toLocaleDateString("pt-BR") : "—");

  return (
    <div>
      <div className="mb-4 flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
        <h1 className="text-lg font-bold text-forneria-black">Usuários</h1>
        <button onClick={() => setNovo(true)} className="rounded-full bg-forneria-red px-5 py-2 text-sm font-bold text-white">
          Adicionar +
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-forneria-black/60">
              <th className="p-3">E-mail</th>
              <th className="p-3">Criado em</th>
              <th className="p-3">Último acesso</th>
              <th className="p-3">Excluir</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b last:border-0 hover:bg-forneria-gray/40">
                <td className="p-3 font-medium text-forneria-black">
                  {u.email} {u.email === superAdmin && <span className="ml-1 rounded bg-forneria-red/10 px-2 py-0.5 text-xs text-forneria-red">principal</span>}
                </td>
                <td className="p-3 text-forneria-black/60">{fmt(u.created_at)}</td>
                <td className="p-3 text-forneria-black/60">{fmt(u.last_sign_in_at)}</td>
                <td className="p-3">
                  {u.email !== superAdmin ? (
                    <button onClick={() => { if (confirm(`Excluir ${u.email}?`)) start(() => deleteUser(u.id)); }} className="text-gray-400 hover:text-forneria-red">🗑</button>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {novo && (
        <Modal title="Novo usuário" onClose={() => setNovo(false)}>
          <form action={(fd) => { start(() => createUser(fd)); setNovo(false); }} className="space-y-3">
            <label className="block text-sm">
              <span className="mb-1 block text-forneria-black/70">E-mail</span>
              <input name="email" type="email" required className={inputCls} />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-forneria-black/70">Senha (mín. 6 caracteres)</span>
              <input name="password" type="text" required minLength={6} className={inputCls} />
            </label>
            <div className="flex justify-end">
              <button type="submit" className="rounded-md bg-forneria-red px-6 py-2 font-bold text-white">Criar</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
