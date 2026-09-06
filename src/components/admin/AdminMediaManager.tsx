import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Image as ImageIcon, Upload, Loader2, Save, Trash2 } from 'lucide-react';

export default function AdminMediaManager() {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await (supabase as any).from('site_settings').select('*');
    if (data) {
      const parsed: Record<string, any> = {};
      data.forEach((row: any) => parsed[row.key] = row.value);
      setSettings(parsed);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeKey) return;

    setUploading(activeKey);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${activeKey}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage.from('platform_assets').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('platform_assets').getPublicUrl(filePath);
      
      const newValue = { url: publicUrlData.publicUrl };
      
      // Upsert into site_settings
      await (supabase as any).from('site_settings').upsert({ key: activeKey, value: newValue });
      
      setSettings(prev => ({ ...prev, [activeKey]: newValue }));
      alert("Asset updated successfully!");
    } catch (err: any) {
      alert("Upload failed: " + err.message + "\\nMake sure 'platform_assets' bucket exists and allows public uploads for authenticated users.");
    } finally {
      setUploading(null);
      setActiveKey(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const triggerUpload = (key: string) => {
    setActiveKey(key);
    fileInputRef.current?.click();
  };

  const ASSET_KEYS = [
    { key: 'kurukshetra_arjuna_img', label: 'Arjuna Battle Sprite', desc: 'Left-side character in Kurukshetra Arena' },
    { key: 'kurukshetra_karna_img', label: 'Karna Battle Sprite', desc: 'Right-side character in Kurukshetra Arena' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-white flex items-center gap-2"><ImageIcon className="text-indigo-400" /> Global Media Manager</h2>
        <p className="text-sm text-slate-400">Upload CMS assets to platform_assets bucket. Updates instantly across the live app.</p>
      </div>

      <input type="file" ref={fileInputRef} className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleUpload} />

      <div className="grid md:grid-cols-2 gap-6">
        {ASSET_KEYS.map((asset) => (
          <div key={asset.key} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-black text-white">{asset.label}</h3>
                <p className="text-xs text-slate-500 mt-1">{asset.desc}</p>
                <code className="text-[10px] bg-slate-950 text-indigo-400 px-2 py-1 rounded mt-2 inline-block">Key: {asset.key}</code>
              </div>
            </div>

            <div className="aspect-video bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden mb-4 relative">
              {settings[asset.key]?.url ? (
                <img src={settings[asset.key].url} alt={asset.label} className="w-full h-full object-contain" />
              ) : (
                <ImageIcon size={48} className="text-slate-800" />
              )}
              
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center backdrop-blur-sm">
                <button 
                  disabled={uploading === asset.key}
                  onClick={() => triggerUpload(asset.key)} 
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm shadow-xl"
                >
                  {uploading === asset.key ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                  Upload Replacement
                </button>
              </div>
            </div>
            
            {settings[asset.key]?.url && (
              <div className="text-xs text-slate-500 truncate bg-slate-950 p-2 rounded border border-slate-800">
                {settings[asset.key].url}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
