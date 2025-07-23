'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

const mutationOptions = [
  'Gold', 'Diamant', 'Candy Mutation', 'Rainbow', 'Bloodroot', 'Celestial',
  'Taco', 'Crab Mutation', 'Nyan Cat', 'Meteor', 'Tung Tung Tung', 'Sahur Mutation'
];

const rarityOptions = [
  'Common', 'Rare', 'Epic', 'Legendary', 'Mythic', 'Brainroot God', 'Secret'
];

export default function Home() {
  const [accounts, setAccounts] = useState([]);
  const [activeAccount, setActiveAccount] = useState(null);
  const [newAccName, setNewAccName] = useState('');
  const [newAccPass, setNewAccPass] = useState('');

  const [brainrootName, setBrainrootName] = useState('');
  const [brainrootIncome, setBrainrootIncome] = useState('');
  const [brainrootRarity, setBrainrootRarity] = useState('Common');
  const [brainrootMutations, setBrainrootMutations] = useState([]);

  const addAccount = () => {
    if (!newAccName || !newAccPass) return;
    setAccounts(prev => [...prev, {
      id: Date.now(),
      name: newAccName,
      password: newAccPass,
      brainroots: []
    }]);
    setNewAccName('');
    setNewAccPass('');
  };

  const addBrainrootToAccount = (accId) => {
    const newRoot = {
      name: brainrootName,
      income: parseFloat(brainrootIncome),
      rarity: brainrootRarity,
      mutations: brainrootMutations
    };

    setAccounts(prev => prev.map(acc =>
      acc.id === accId ? {
        ...acc,
        brainroots: [...acc.brainroots, newRoot]
      } : acc
    ));

    setBrainrootName('');
    setBrainrootIncome('');
    setBrainrootRarity('Common');
    setBrainrootMutations([]);
  };

  const removeBrainroot = (accId, index) => {
    setAccounts(prev => prev.map(acc =>
      acc.id === accId ? {
        ...acc,
        brainroots: acc.brainroots.filter((_, i) => i !== index)
      } : acc
    ));
  };

  const totalStats = useMemo(() => {
    let all = accounts.flatMap(acc => acc.brainroots);
    let mostValuable = all.reduce((prev, curr) => (curr.income > (prev?.income || 0) ? curr : prev), null);
    let rarest = all.reduce((prev, curr) =>
      rarityOptions.indexOf(curr.rarity) > rarityOptions.indexOf(prev?.rarity ?? 'Common') ? curr : prev, null);
    return { mostValuable, rarest };
  }, [accounts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Steal a Brainroot Manager</h1>

      {totalStats.rarest && (
        <div className="mb-6 p-4 bg-white/10 rounded border border-white/20">
          <p><strong>Seltenster Brainroot:</strong> {totalStats.rarest.name} ({totalStats.rarest.rarity})</p>
          <p><strong>Wertvollster Brainroot:</strong> {totalStats.mostValuable.name} ({totalStats.mostValuable.income} /s)</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {accounts.map(acc => {
          const totalIncome = acc.brainroots.reduce((sum, b) => sum + (b.income || 0), 0);
          const rarest = acc.brainroots.reduce((prev, curr) =>
            rarityOptions.indexOf(curr.rarity) > rarityOptions.indexOf(prev?.rarity ?? 'Common') ? curr : prev, null);

          return (
            <div key={acc.id} className="bg-white/10 p-4 rounded shadow border border-white/20">
              <h2 className="text-xl font-bold">{acc.name}</h2>
              <p className="text-sm text-white/60">Passwort: {acc.password}</p>
              <p className="mt-2 text-sm">Anzahl Brainroots: {acc.brainroots.length}</p>
              <p className="text-sm">Einkommen: {totalIncome}/s</p>
              <p className="text-sm">Seltenster: {rarest?.name} ({rarest?.rarity})</p>

              <div className="mt-2 space-y-1">
                {acc.brainroots.map((b, idx) => (
                  <div key={idx} className="bg-white/5 p-2 rounded text-sm flex justify-between items-center">
                    <div>
                      {b.name} – {b.rarity} – {b.income}/s
                      <br />
                      <span className="text-xs text-white/50">{b.mutations.join(', ')}</span>
                    </div>
                    <button onClick={() => removeBrainroot(acc.id, idx)} className="text-red-400 hover:text-red-600">✖</button>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t border-white/20 pt-3 space-y-2">
                <Input value={brainrootName} onChange={e => setBrainrootName(e.target.value)} placeholder="Name" />
                <Input value={brainrootIncome} onChange={e => setBrainrootIncome(e.target.value)} placeholder="Geld/s" type="number" />
                <Select onValueChange={setBrainrootRarity} value={brainrootRarity}>
                  <SelectTrigger><SelectValue placeholder="Seltenheit" /></SelectTrigger>
                  <SelectContent>
                    {rarityOptions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
                <ScrollArea className="h-24 p-2 border rounded">
                  {mutationOptions.map(m => (
                    <label key={m} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={brainrootMutations.includes(m)}
                        onChange={() =>
                          setBrainrootMutations(prev =>
                            prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]
                          )
                        }
                      />
                      <span>{m}</span>
                    </label>
                  ))}
                </ScrollArea>
                <Button onClick={() => addBrainrootToAccount(acc.id)}>Brainroot hinzufügen</Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Account hinzufügen (versteckter Dialog) */}
      <div className="fixed bottom-4 right-4">
        <Dialog>
          <DialogTrigger>
            <Button variant="ghost" className="text-white text-3xl hover:text-green-300">＋</Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-white/20">
            <Input value={newAccName} onChange={e => setNewAccName(e.target.value)} placeholder="Accountname" className="mb-2" />
            <Input value={newAccPass} onChange={e => setNewAccPass(e.target.value)} placeholder="Passwort" className="mb-2" />
            <Button onClick={addAccount} className="w-full">Account erstellen</Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
