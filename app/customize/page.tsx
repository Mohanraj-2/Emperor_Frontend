'use client';
import { useState, useRef, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Type,
  Image as ImageIcon,
  Upload,
  RotateCcw,
  Eye,
  Layers,
  Palette,
  Trash2,
  Bold,
  Italic,
  AlignCenter,
  Move,
  Plus,
  Download,
  ShoppingBag,
  Crown,
} from 'lucide-react';
import Link from 'next/link';

type DesignElement = {
  id: string;
  type: 'text' | 'image';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  rotation?: number;
};

const FONTS = ['Poppins', 'Playfair Display', 'Arial', 'Georgia', 'Courier New', 'Impact'];
const GARMENT_COLORS = [
  { name: 'Navy', hex: '#0B1F4D' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Pink', hex: '#F7B6C6' },
  { name: 'Black', hex: '#1F2937' },
  { name: 'Gray', hex: '#9CA3AF' },
  { name: 'Maroon', hex: '#7F1D1D' },
];

const SIDEBAR_TABS = [
  { id: 'product', icon: ShoppingBag, label: 'Product' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'upload', icon: Upload, label: 'Upload' },
  { id: 'colors', icon: Palette, label: 'Colors' },
  { id: 'layers', icon: Layers, label: 'Layers' },
];

let idCounter = 1;

export default function CustomizePage() {
  const [side, setSide] = useState<'front' | 'back'>('front');
  const [garmentColor, setGarmentColor] = useState('#FFFFFF');
  const [frontElements, setFrontElements] = useState<DesignElement[]>([]);
  const [backElements, setBackElements] = useState<DesignElement[]>([]);
  const [activeTab, setActiveTab] = useState('text');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newText, setNewText] = useState('YOUR TEXT HERE');
  const [newFont, setNewFont] = useState('Poppins');
  const [newColor, setNewColor] = useState('#0B1F4D');
  const [newFontSize, setNewFontSize] = useState(24);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const elements = side === 'front' ? frontElements : backElements;
  const setElements = side === 'front' ? setFrontElements : setBackElements;
  const selected = elements.find((e) => e.id === selectedId) || null;

  const addText = () => {
    const el: DesignElement = {
      id: `el-${idCounter++}`,
      type: 'text',
      content: newText,
      x: 60,
      y: 60,
      width: 160,
      height: 40,
      fontSize: newFontSize,
      fontFamily: newFont,
      color: newColor,
      bold: false,
      italic: false,
      rotation: 0,
    };
    setElements((prev) => [...prev, el]);
    setSelectedId(el.id);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const el: DesignElement = {
      id: `el-${idCounter++}`,
      type: 'image',
      content: url,
      x: 60,
      y: 80,
      width: 120,
      height: 120,
      rotation: 0,
    };
    setElements((prev) => [...prev, el]);
    setSelectedId(el.id);
  };

  const updateSelected = (updates: Partial<DesignElement>) => {
    if (!selectedId) return;
    setElements((prev) => prev.map((e) => (e.id === selectedId ? { ...e, ...updates } : e)));
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setElements((prev) => prev.filter((e) => e.id !== selectedId));
    setSelectedId(null);
  };

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedId(id);
    const rect = canvasRef.current?.getBoundingClientRect();
    const el = elements.find((e) => e.id === id);
    if (!rect || !el) return;
    setDragging(true);
    setDragOffset({
      x: e.clientX - rect.left - el.x,
      y: e.clientY - rect.top - el.y,
    });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging || !selectedId || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width - 20, e.clientX - rect.left - dragOffset.x));
      const y = Math.max(0, Math.min(rect.height - 20, e.clientY - rect.top - dragOffset.y));
      updateSelected({ x, y });
    },
    [dragging, selectedId, dragOffset]
  );

  const handleMouseUp = () => setDragging(false);

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-gray-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div>
            <h1 className="font-playfair text-2xl font-bold text-white flex items-center gap-2">
              <Crown className="w-6 h-6 text-pink-400" />
              Custom T-Shirt Designer
            </h1>
            <p className="font-poppins text-gray-300 text-sm mt-1">Design your own empire</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-outline border-white/30 text-white hover:bg-white/10 text-sm">
              <Download className="w-4 h-4" /> Save Design
            </button>
            <Link href="/cart" className="btn-pink text-sm">
              <ShoppingBag className="w-4 h-4" /> Add to Cart
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-16 bg-gray-900 flex flex-col items-center py-4 gap-2 flex-shrink-0">
          {SIDEBAR_TABS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              title={label}
              className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-colors ${
                activeTab === id ? 'bg-pink-400 text-gray-900' : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[8px] font-poppins">{label}</span>
            </button>
          ))}
        </div>

        {/* Tool Panel */}
        <div className="w-56 bg-gray-50 border-r border-gray-200 overflow-y-auto flex-shrink-0 p-4">
          {activeTab === 'text' && (
            <div className="space-y-4">
              <h3 className="font-poppins font-semibold text-gray-900 text-sm">Add Text</h3>
              <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-poppins outline-none focus:border-gray-500 resize-none"
                placeholder="Enter text..."
              />
              <div>
                <label className="font-poppins text-xs text-gray-500 mb-1 block">Font</label>
                <select
                  value={newFont}
                  onChange={(e) => setNewFont(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs font-poppins outline-none"
                >
                  {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="font-poppins text-xs text-gray-500 mb-1 block">Size: {newFontSize}px</label>
                <input type="range" min={10} max={80} value={newFontSize}
                  onChange={(e) => setNewFontSize(Number(e.target.value))}
                  className="w-full accent-gray-900" />
              </div>
              <div>
                <label className="font-poppins text-xs text-gray-500 mb-1 block">Color</label>
                <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)}
                  className="w-full h-9 rounded-lg border border-gray-200 cursor-pointer" />
              </div>
              <button onClick={addText} className="w-full btn-navy justify-center text-xs py-3 rounded-xl">
                <Plus className="w-4 h-4" /> Add Text
              </button>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-4">
              <h3 className="font-poppins font-semibold text-gray-900 text-sm">Upload Image</h3>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-xl py-8 flex flex-col items-center gap-2 hover:border-gray-500 transition-colors"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="font-poppins text-xs text-gray-500 text-center">Click to upload<br />PNG, JPG, SVG</span>
              </button>
            </div>
          )}

          {activeTab === 'colors' && (
            <div className="space-y-4">
              <h3 className="font-poppins font-semibold text-gray-900 text-sm">Garment Color</h3>
              <div className="grid grid-cols-3 gap-2">
                {GARMENT_COLORS.map(({ name, hex }) => (
                  <button
                    key={hex}
                    title={name}
                    onClick={() => setGarmentColor(hex)}
                    style={{ backgroundColor: hex }}
                    className={`h-10 rounded-xl border-4 transition-all ${
                      garmentColor === hex ? 'border-pink-500 scale-105' : 'border-gray-200'
                    }`}
                  />
                ))}
              </div>
              <div>
                <label className="font-poppins text-xs text-gray-500 mb-1 block">Custom Color</label>
                <input type="color" value={garmentColor} onChange={(e) => setGarmentColor(e.target.value)}
                  className="w-full h-9 rounded-lg border border-gray-200 cursor-pointer" />
              </div>
            </div>
          )}

          {activeTab === 'layers' && (
            <div className="space-y-3">
              <h3 className="font-poppins font-semibold text-gray-900 text-sm">Layers ({elements.length})</h3>
              {elements.length === 0 && (
                <p className="font-poppins text-xs text-gray-400 text-center py-8">No elements yet.<br />Add text or upload an image.</p>
              )}
              {[...elements].reverse().map((el, i) => (
                <button
                  key={el.id}
                  onClick={() => setSelectedId(el.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors ${
                    selectedId === el.id ? 'border-gray-900 bg-pink-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {el.type === 'text' ? <Type className="w-3 h-3 text-gray-500 flex-shrink-0" /> : <ImageIcon className="w-3 h-3 text-gray-500 flex-shrink-0" />}
                  <span className="font-poppins text-xs text-gray-700 truncate">{el.type === 'text' ? el.content : 'Image'}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 p-8 gap-6">
          {/* Side toggle */}
          <div className="flex items-center gap-0 bg-white rounded-full border border-gray-200 shadow-sm overflow-hidden">
            {(['front', 'back'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSide(s)}
                className={`px-6 py-2 font-poppins text-sm font-medium transition-colors ${
                  side === s ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>

          {/* T-shirt canvas */}
          <div
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={() => setSelectedId(null)}
            className="relative select-none"
            style={{ width: 280, height: 340 }}
          >
            {/* T-shirt shape SVG */}
            <svg viewBox="0 0 280 340" className="absolute inset-0 w-full h-full drop-shadow-2xl">
              <path
                d="M70 0 L0 60 L30 80 L30 340 L250 340 L250 80 L280 60 L210 0 L175 30 Q140 50 105 30 Z"
                fill={garmentColor}
                stroke="#E5E7EB"
                strokeWidth="1.5"
              />
            </svg>

            {/* Design zone */}
            <div
              className="absolute border-2 border-dashed border-pink-300/60 rounded-lg overflow-hidden pointer-events-none"
              style={{ left: 70, top: 90, width: 140, height: 160 }}
            />

            {/* Design elements */}
            {elements.map((el) => (
              <div
                key={el.id}
                onMouseDown={(e) => handleMouseDown(e, el.id)}
                style={{
                  position: 'absolute',
                  left: el.x,
                  top: el.y,
                  transform: `rotate(${el.rotation || 0}deg)`,
                  cursor: dragging && selectedId === el.id ? 'grabbing' : 'grab',
                  outline: selectedId === el.id ? '2px dashed #F7B6C6' : 'none',
                  outlineOffset: '3px',
                  borderRadius: 4,
                  userSelect: 'none',
                }}
              >
                {el.type === 'text' ? (
                  <span
                    style={{
                      fontSize: el.fontSize,
                      fontFamily: el.fontFamily,
                      color: el.color,
                      fontWeight: el.bold ? 'bold' : 'normal',
                      fontStyle: el.italic ? 'italic' : 'normal',
                      whiteSpace: 'nowrap',
                      display: 'block',
                    }}
                  >
                    {el.content}
                  </span>
                ) : (
                  <img
                    src={el.content}
                    alt="design"
                    style={{ width: el.width, height: el.height, objectFit: 'contain', display: 'block', pointerEvents: 'none' }}
                    draggable={false}
                  />
                )}
              </div>
            ))}
          </div>

          <p className="font-poppins text-xs text-gray-400">Drag elements to reposition • Click to select</p>
        </div>

        {/* Right Edit Panel */}
        <div className="w-56 bg-white border-l border-gray-200 flex-shrink-0 p-4 overflow-y-auto">
          {selected ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-poppins font-semibold text-gray-900 text-sm">Edit</h3>
                <button onClick={deleteSelected} className="text-red-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {selected.type === 'text' && (
                <>
                  <div>
                    <label className="font-poppins text-xs text-gray-500 mb-1 block">Text</label>
                    <input
                      value={selected.content}
                      onChange={(e) => updateSelected({ content: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs font-poppins outline-none focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label className="font-poppins text-xs text-gray-500 mb-1 block">Font Size: {selected.fontSize}px</label>
                    <input type="range" min={10} max={80} value={selected.fontSize || 24}
                      onChange={(e) => updateSelected({ fontSize: Number(e.target.value) })}
                      className="w-full accent-gray-900" />
                  </div>
                  <div>
                    <label className="font-poppins text-xs text-gray-500 mb-1 block">Font</label>
                    <select value={selected.fontFamily} onChange={(e) => updateSelected({ fontFamily: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs font-poppins outline-none">
                      {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-poppins text-xs text-gray-500 mb-1 block">Color</label>
                    <input type="color" value={selected.color || '#000'} onChange={(e) => updateSelected({ color: e.target.value })}
                      className="w-full h-9 rounded-lg border border-gray-200 cursor-pointer" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateSelected({ bold: !selected.bold })}
                      className={`flex-1 py-2 rounded-lg border text-xs font-poppins font-bold transition-colors ${selected.bold ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600'}`}
                    >
                      B
                    </button>
                    <button
                      onClick={() => updateSelected({ italic: !selected.italic })}
                      className={`flex-1 py-2 rounded-lg border text-xs font-poppins italic transition-colors ${selected.italic ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600'}`}
                    >
                      I
                    </button>
                  </div>
                </>
              )}

              {selected.type === 'image' && (
                <>
                  <div>
                    <label className="font-poppins text-xs text-gray-500 mb-1 block">Width: {selected.width}px</label>
                    <input type="range" min={40} max={200} value={selected.width}
                      onChange={(e) => updateSelected({ width: Number(e.target.value), height: Number(e.target.value) })}
                      className="w-full accent-gray-900" />
                  </div>
                </>
              )}

              <div>
                <label className="font-poppins text-xs text-gray-500 mb-1 block">Rotation: {selected.rotation || 0}°</label>
                <input type="range" min={-180} max={180} value={selected.rotation || 0}
                  onChange={(e) => updateSelected({ rotation: Number(e.target.value) })}
                  className="w-full accent-gray-900" />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                <div>
                  <label className="font-poppins text-xs text-gray-500 mb-1 block">X</label>
                  <input type="number" value={Math.round(selected.x)} onChange={(e) => updateSelected({ x: Number(e.target.value) })}
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-poppins outline-none" />
                </div>
                <div>
                  <label className="font-poppins text-xs text-gray-500 mb-1 block">Y</label>
                  <input type="number" value={Math.round(selected.y)} onChange={(e) => updateSelected({ y: Number(e.target.value) })}
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-poppins outline-none" />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Move className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="font-poppins text-xs text-gray-400">Select an element<br />to edit its properties</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
