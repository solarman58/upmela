import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { useMapStore } from '../../store/useMapStore';
import { FiUploadCloud, FiTrash2, FiPlus, FiEdit3, FiSave, FiX, FiLayers, FiChevronDown, FiSettings, FiPrinter, FiDownload, FiArchive } from 'react-icons/fi';

export default function FloorManager() {
  const { floors, nodes, addFloor, editFloor, deleteFloor, buildings, currentBuilding, setBuilding, addBuilding, editBuilding, addToast, currentFloor, setFloor, appSettings, linkNodeToFloor } = useMapStore();
  const isMela = appSettings?.project_type === 'Mela' || appSettings?.project_type === 'Kumbh Mela';
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingBuilding, setIsAddingBuilding] = useState(false);
  const [newBuildingName, setNewBuildingName] = useState('');
  
  const [isSavingFloor, setIsSavingFloor] = useState(false);
  const [isDeletingFloor, setIsDeletingFloor] = useState(false);
  const [isEditingBuilding, setIsEditingBuilding] = useState(false);
  const [editBuildingName, setEditBuildingName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [floorToDelete, setFloorToDelete] = useState(null);
  const [buildingToDelete, setBuildingToDelete] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [activeSelect, setActiveSelect] = useState(null);
  
  // Form States
  const [level, setLevel] = useState('');
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);

  const handleDownloadZip = async () => {
    setIsGeneratingZip(true);
    try {
      const poiNodes = nodes.filter(n => n.floor === currentFloor && n.category !== 'waypoint');
      const floorName = floors.find(f => f.id === currentFloor)?.name || 'Floor';

      if (poiNodes.length === 0) {
        addToast("No POI nodes found on this floor.", "error");
        return;
      }

      const zip = new JSZip();
      const folderName = `Margyaan_QRCodes_${floorName.replace(/\s+/g, '_')}`;
      const folder = zip.folder(folderName);

      const pageWidth = 210;  // A4 mm
      const pageHeight = 297;
      const qrSize = 100;
      const centerX = pageWidth / 2;
      const centerY = pageHeight / 2;

      for (let i = 0; i < poiNodes.length; i++) {
        const node = poiNodes[i];
        const canvas = document.getElementById(`qr-canvas-${node.id}`);
        if (!canvas) continue;

        const imgData = canvas.toDataURL('image/png', 1.0);
        const nodeName = (node.name || node.label || node.category || 'Node').replace(/[/\\?%*:|"<>]/g, '-');
        const nodeId = node.id.slice(-8);

        // Create individual PDF for this node
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

        // Header background bar
        doc.setFillColor(14, 165, 233); // sky-500
        doc.rect(0, 0, pageWidth, 28, 'F');

        // Header text: MARGYAAN
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('MARGYAAN', centerX, 11, { align: 'center' });

        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.text('Scan & Navigate — Indoor Navigation System', centerX, 19, { align: 'center' });

        // Floor label
        doc.setTextColor(100, 116, 139); // slate-500
        doc.setFontSize(9);
        doc.text(`Floor: ${floorName}`, centerX, 38, { align: 'center' });

        // Node name
        doc.setTextColor(15, 23, 42); // slate-900
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        const maxChars = 30;
        const displayName = nodeName.length > maxChars ? nodeName.substring(0, maxChars) + '…' : nodeName;
        doc.text(displayName, centerX, 52, { align: 'center' });

        // QR Code — centered
        const imgX = centerX - (qrSize / 2);
        const imgY = centerY - (qrSize / 2) + 10;
        doc.addImage(imgData, 'PNG', imgX, imgY, qrSize, qrSize);

        // Instruction text
        doc.setTextColor(71, 85, 105); // slate-600
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text('Point your camera at this QR code to navigate directly to this location.', centerX, imgY + qrSize + 14, { align: 'center', maxWidth: 160 });

        // Node ID badge
        doc.setFillColor(241, 245, 249); // slate-100
        doc.roundedRect(centerX - 30, imgY + qrSize + 22, 60, 10, 3, 3, 'F');
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(8);
        doc.setFont(undefined, 'bold');
        doc.text(`NODE ID: ${nodeId}`, centerX, imgY + qrSize + 28.5, { align: 'center' });

        // Footer
        doc.setFillColor(248, 250, 252); // slate-50
        doc.rect(0, pageHeight - 16, pageWidth, 16, 'F');
        doc.setTextColor(148, 163, 184); // slate-400
        doc.setFontSize(7.5);
        doc.setFont(undefined, 'normal');
        doc.text('margyaan.com  •  Powered by Margyaan Indoor Navigation', centerX, pageHeight - 7, { align: 'center' });

        // Save PDF as blob and add to ZIP
        const pdfBytes = doc.output('arraybuffer');
        const safeFileName = `${String(i + 1).padStart(3, '0')}_${nodeName.substring(0, 40)}_${nodeId}.pdf`;
        folder.file(safeFileName, pdfBytes);
      }

      // Generate and download ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${folderName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addToast(`✅ ZIP downloaded — ${poiNodes.length} QR PDFs inside!`, 'success');
    } catch (err) {
      console.error("ZIP generation failed", err);
      addToast("Failed to generate ZIP. Please try again.", "error");
    } finally {
      setIsGeneratingZip(false);
    }
  };

  // Main Ground Map upload handler
  const handleUploadMainGround = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('map', file);

    try {
      const res = await fetch('/api/upload-floor-map', {
        method: 'POST',
        headers: {
          ...(useMapStore.getState().token ? { 'Authorization': `Bearer ${useMapStore.getState().token}` } : {})
        },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        const mainFloor = floors.find(f => f.level === 'MAIN' || f.name.toLowerCase().includes('main'));
        if (mainFloor) {
          await editFloor(mainFloor.id, 'MAIN', mainFloor.name, data.url);
          addToast('Main Mela Ground Map updated successfully!', 'success');
        } else {
          await addFloor('MAIN', 'Main Mela Ground (Overview)', data.url);
          addToast('Main Mela Ground Map uploaded successfully!', 'success');
        }
      } else {
        const err = await res.json().catch(() => ({}));
        addToast(err.error || 'Upload failed. Please try again.', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Error uploading map image.', 'error');
    } finally {
      setUploading(false);
    }
  };

  // File upload handler
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setPreview(URL.createObjectURL(file));

    // Send file as FormData for multer
    const formData = new FormData();
    formData.append('map', file);

    try {
      const res = await fetch('/api/upload-floor-map', {
        method: 'POST',
        headers: {
          ...(useMapStore.getState().token ? { 'Authorization': `Bearer ${useMapStore.getState().token}` } : {})
        },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setImageUrl(data.url);
        addToast('Sector map image uploaded! Click Save to finish.', 'success');
      } else {
          addToast('Upload failed. Please try again.', 'error');
        }
      } catch (err) {
        console.error(err);
        addToast('Error uploading blueprint.', 'error');
      } finally {
        setUploading(false);
      }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!level.trim() || !name.trim()) {
      addToast("Level code and Floor name are required", "error");
      return;
    }
    
    setIsSavingFloor(true);
    try {
      if (editingId) {
        await editFloor(editingId, level, name, imageUrl);
        addToast(`Updated floor ${level} successfully`, "success");
      } else {
        await addFloor(level, name, imageUrl);
        addToast(`Added new floor ${level}`, "success");
      }
      setIsAdding(false);
      setEditingId(null);
      setLevel('');
      setName('');
      setImageUrl('');
      setPreview(null);
    } finally {
      setIsSavingFloor(false);
    }
  };

  const handleStartEdit = (floor) => {
    setEditingId(floor.id);
    setLevel(floor.level);
    setName(floor.name);
    setImageUrl(floor.image);
    setPreview(floor.image);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setLevel('');
    setName('');
    setImageUrl('');
    setPreview(null);
  };

  return (
    <div className="flex flex-col gap-4 text-xs">
      {/* ── BUILDING MANAGER ── */}
      <div className="flex flex-col gap-2 p-3 bg-slate-100/50 dark:bg-slate-900/50 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isMela ? 'Active Mela Area' : 'Active Building'}</label>
          <button 
            onClick={() => setIsAddingBuilding(!isAddingBuilding)}
            className="text-sky-500 hover:text-sky-600 font-bold flex items-center gap-1 cursor-pointer"
          >
            {isAddingBuilding ? <FiX className="w-3 h-3" /> : <FiPlus className="w-3 h-3" />}
            {isAddingBuilding ? 'Cancel' : 'New'}
          </button>
        </div>

        {isAddingBuilding ? (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Terminal 2"
              value={newBuildingName}
              onChange={(e) => setNewBuildingName(e.target.value)}
              className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none focus:border-sky-500 text-[16px]"
            />
            <button
              onClick={() => {
                if(newBuildingName.trim()){
                  addBuilding(newBuildingName.trim(), '');
                  setNewBuildingName('');
                  setIsAddingBuilding(false);
                }
              }}
              className="bg-sky-500 text-white px-3 rounded-lg font-bold hover:bg-sky-600 cursor-pointer"
            >
              Add
            </button>
          </div>
        ) : isEditingBuilding ? (
          <div className="flex flex-col gap-2 p-3 bg-white dark:bg-slate-800 rounded-xl border border-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.15)] relative transition-all">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest flex items-center gap-1.5">
                <FiEdit3 className="w-3 h-3" /> Rename Building
              </span>
              <button onClick={() => setIsEditingBuilding(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 bg-slate-100 dark:bg-slate-700/50 rounded-full active:scale-90 transition-all">
                <FiX className="w-3 h-3" />
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={editBuildingName}
                onChange={(e) => setEditBuildingName(e.target.value)}
                autoFocus
                placeholder="Terminal Name"
                className="flex-1 min-w-0 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-[14px] font-black text-slate-800 dark:text-white transition-all shadow-inner"
              />
              <button
                onClick={() => {
                  if(editBuildingName.trim()){
                    editBuilding(currentBuilding, editBuildingName.trim());
                    setIsEditingBuilding(false);
                  }
                }}
                className="bg-sky-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-sky-600 cursor-pointer active:scale-95 transition-all flex flex-shrink-0 items-center justify-center gap-2 shadow-md shadow-sky-500/20"
              >
                <FiSave className="w-4 h-4" /> <span className="hidden sm:inline">Save</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl shadow-sm relative hover:border-sky-300 dark:hover:border-sky-700 transition-colors">
            {buildings.length > 1 && (
              <select 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                value={currentBuilding || ''}
                onChange={(e) => setBuilding(e.target.value)}
              >
                {buildings.map(b => (
                  <option key={b.id} value={b.id} className="text-slate-800">{b.name}</option>
                ))}
              </select>
            )}
            
            <div className="flex flex-col flex-1 relative pointer-events-none pr-2">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black text-slate-800 dark:text-slate-100">
                  {buildings.find(b => b.id === currentBuilding)?.name || 'Unknown Building'}
                </span>
                {buildings.length > 1 && <FiChevronDown className="w-4 h-4 text-slate-400" />}
              </div>
              <span className="text-[10px] font-bold text-sky-500 uppercase tracking-widest">{floors.length} {isMela ? 'Sectors & Maps' : 'Floors Active'}</span>
            </div>
            
            <div className="flex items-center gap-1 relative z-20 pointer-events-auto">
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  const bName = buildings.find(b => b.id === currentBuilding)?.name;
                  setEditBuildingName(bName || '');
                  setIsEditingBuilding(true);
                }} 
                className="p-2 text-slate-400 hover:text-sky-500 bg-slate-50 hover:bg-sky-50 dark:bg-slate-900 dark:hover:bg-sky-500/10 rounded-lg transition-colors cursor-pointer" 
                title="Edit Building Name"
              >
                <FiEdit3 className="w-4 h-4" />
              </button>
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setBuildingToDelete(buildings.find(b => b.id === currentBuilding)); 
                }} 
                className="p-2 text-slate-400 hover:text-rose-500 bg-slate-50 hover:bg-rose-50 dark:bg-slate-900 dark:hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer" 
                title="Delete Building"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── MELA MAIN GROUND MAP HERO CARD ── */}
      {isMela && (
        <div className="p-4 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-slate-900/50 shadow-lg flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl p-2 rounded-xl bg-amber-500/20 border border-amber-500/30">🗺️</span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-sm text-slate-800 dark:text-white">Main Mela Ground Map</h4>
                  <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30">
                    MASTER OVERVIEW
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Pure mela kshetra ka main layout map jahan aap sectors aur edges tag karenge.
                </p>
              </div>
            </div>
          </div>

          {(() => {
            const mainFloor = floors.find(f => f.level === 'MAIN' || f.name.toLowerCase().includes('main'));
            if (mainFloor && mainFloor.image) {
              return (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/60 dark:bg-slate-950/60 border border-amber-500/20 gap-3">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <img src={mainFloor.image} alt="Main Ground" className="w-12 h-10 object-cover rounded-lg border border-slate-700" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{mainFloor.name}</p>
                      <p className="text-[9px] text-emerald-500 font-bold flex items-center gap-1">
                        <span>✓</span> Active Master Map
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setFloor(mainFloor.id)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      View Map
                    </button>
                    <label className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] transition-all cursor-pointer active:scale-95">
                      Change
                      <input type="file" accept="image/*" className="hidden" onChange={handleUploadMainGround} />
                    </label>
                  </div>
                </div>
              );
            }

            return (
              <label className="w-full py-3.5 px-4 rounded-xl border-2 border-dashed border-amber-500/50 hover:border-amber-400 bg-amber-500/5 hover:bg-amber-500/10 text-amber-500 font-black text-xs text-center cursor-pointer active:scale-95 transition-all flex flex-col items-center justify-center gap-1.5">
                <FiUploadCloud className="w-5 h-5 animate-bounce" />
                <span>Upload Main Mela Ground Image (Click Here)</span>
                <span className="text-[9px] text-slate-400 font-normal">PNG, JPG, WebP up to 50MB</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleUploadMainGround} />
              </label>
            );
          })()}
        </div>
      )}

      {/* ── FLOOR MANAGER ── */}
      <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/40 pb-3">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <FiLayers className="w-4 h-4 text-sky-500" />
          {isMela ? 'Mela Sectors & Maps' : 'Floors in Active Building'}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowQrModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
            title="Export QR Codes for all POIs on this floor"
          >
            <FiPrinter className="w-3.5 h-3.5" />
            Export QR Codes
          </button>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-bold transition-all shadow-md shadow-sky-500/10 cursor-pointer"
            >
              <FiPlus className="w-3.5 h-3.5" />
              {isMela ? 'Add Sector' : 'Add Floor'}
            </button>
          )}
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="flex flex-col gap-3.5 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-md">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {editingId ? (isMela ? 'Edit Sector / Map' : 'Edit Floor') : (isMela ? 'Create New Sector' : 'Create New Floor')}
            </span>
            <button
              type="button"
              onClick={handleCancel}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{isMela ? 'Code (e.g. S1)' : 'Code'}</label>
              <input
                type="text"
                placeholder={isMela ? 'S1' : 'L5'}
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 focus:ring-1 focus:ring-sky-500 focus:outline-none dark:text-white text-[16px]"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{isMela ? 'Sector Name (e.g. Sector 1)' : 'Floor Name'}</label>
              <input
                type="text"
                placeholder={isMela ? 'Sector 1' : 'Roof Lounge'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 focus:ring-1 focus:ring-sky-500 focus:outline-none dark:text-white text-[16px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{isMela ? 'Sector Map Image' : 'Map Blueprint Image'}</label>
            <div className="relative group flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 rounded-xl p-4 transition-colors cursor-pointer bg-white dark:bg-slate-950/40">
              {preview ? (
                <div className="relative w-full h-32 rounded-lg overflow-hidden flex items-center justify-center bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40">
                  <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="text-white text-xs font-bold bg-slate-900/80 px-2 py-1 rounded-md">Change Map</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 py-4">
                  <FiUploadCloud className="w-8 h-8 text-slate-400 group-hover:text-sky-500 transition-colors" />
                  <span className="font-bold text-slate-600 dark:text-slate-400">Click to upload image</span>
                  <span className="text-[10px] text-slate-400">PNG, JPG or SVG blueprints</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required={!editingId}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 flex items-center justify-center rounded-xl">
                  <span className="font-bold text-sky-500 animate-pulse">Uploading map...</span>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading || isSavingFloor}
            className="w-full py-2.5 rounded-lg bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/10"
          >
            {isSavingFloor ? (
              <span className="flex items-center gap-2">
                <FiSettings className="w-4 h-4 animate-spin" /> Saving...
              </span>
            ) : (
              <>
                <FiSave className="w-4 h-4" />
                {editingId ? (isMela ? 'Update Sector Map' : 'Update Blueprint') : (isMela ? 'Save Sector Map' : 'Add Floor Blueprint')}
              </>
            )}
          </button>
        </form>
      )}

      <div className="flex flex-col gap-2">
        <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{isMela ? 'All Sectors & Maps (Click to View / Edit)' : 'Active Floor Levels'}</span>
        {floors.map((floor) => (
          <div
            key={floor.id}
            className="flex flex-col p-3 rounded-2xl border border-slate-200/70 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/40 hover:border-sky-300 dark:hover:border-sky-700 transition-all gap-2.5 overflow-hidden shadow-sm"
          >
            {/* Top Row: Info + Action Buttons */}
            <div className="flex items-start justify-between gap-2 w-full">
              {/* Level Badge + Name Details */}
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 flex-shrink-0 mt-0.5">
                  {floor.level}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                    <span className="font-extrabold text-[12.5px] text-slate-800 dark:text-slate-100 leading-snug break-words">
                      {floor.name}
                    </span>
                    {floor.level === 'MAIN' && (
                      <span className="text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                        MASTER
                      </span>
                    )}
                    {floor.id === currentFloor && (
                      <span className="text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1 truncate">
                    {floor.image ? (
                      <span className="text-emerald-500 font-bold flex items-center gap-1">
                        <span>✓</span> Map Uploaded
                      </span>
                    ) : (
                      <span className="text-amber-500 font-bold flex items-center gap-1">
                        <span>⚠</span> No Map Image
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Action Buttons (Fixed shrink to NEVER overflow card boundary) */}
              <div className="flex items-center gap-1 flex-shrink-0 ml-1">
                <button
                  type="button"
                  onClick={() => setFloor(floor.id)}
                  className={`px-2.5 py-1 text-[10px] font-black rounded-lg transition-all cursor-pointer shadow-sm active:scale-95 ${
                    floor.id === currentFloor
                      ? 'bg-sky-500 text-white'
                      : 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-200/60 dark:border-sky-800/50 hover:bg-sky-500 hover:text-white'
                  }`}
                  title="Switch to this Map"
                >
                  View
                </button>
                <button
                  type="button"
                  onClick={() => handleStartEdit(floor)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors cursor-pointer"
                  title="Edit Floor"
                >
                  <FiEdit3 className="w-3.5 h-3.5" />
                </button>
                {floor.level !== 'MAIN' && (
                  <button
                    type="button"
                    onClick={() => setFloorToDelete(floor)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Delete Sector"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Row: Admin linking control for Mela Sector detailed map */}
            {isMela && floor.level !== 'MAIN' && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2 w-full">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
                  <span className="text-amber-500 text-xs">🔗</span>
                  <span>Linked Pin:</span>
                </span>
                <select
                  value={nodes.find(n => (n.targetFloor === floor.id || n.target_floor === floor.id))?.id || ''}
                  onChange={(e) => {
                    const selectedNodeId = e.target.value;
                    const prevNode = nodes.find(n => (n.targetFloor === floor.id || n.target_floor === floor.id));
                    if (prevNode && prevNode.id !== selectedNodeId) {
                      linkNodeToFloor(prevNode.id, null);
                    }
                    if (selectedNodeId) {
                      linkNodeToFloor(selectedNodeId, floor.id);
                    }
                  }}
                  className="text-[11px] font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-amber-400 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-100 outline-none focus:border-amber-500 flex-1 min-w-0 truncate shadow-sm cursor-pointer"
                >
                  <option value="">-- No Pin Linked --</option>
                  {nodes
                    .filter(n => n.category !== 'waypoint')
                    .map(n => (
                      <option key={n.id} value={n.id}>
                        📍 {n.name}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {floorToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl max-w-sm w-full p-6 shadow-2xl flex flex-col gap-4 text-center"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-rose-500 text-lg shadow-inner">
                <FiTrash2 className="w-5 h-5 animate-pulse" />
              </div>
              
              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-extrabold text-slate-850 dark:text-slate-105 tracking-wide">
                  Delete Floor Blueprint?
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-1">
                  Are you sure you want to delete <strong className="text-slate-700 dark:text-slate-200">"{floorToDelete.name}"</strong>? All map data and Points of Interest on this floor level will be permanently erased.
                </p>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setFloorToDelete(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-850 active:scale-95 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeletingFloor}
                  onClick={async () => {
                    setIsDeletingFloor(true);
                    try {
                      await deleteFloor(floorToDelete.id);
                      setFloorToDelete(null);
                      addToast("Floor deleted successfully", "success");
                    } finally {
                      setIsDeletingFloor(false);
                    }
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold shadow-lg shadow-rose-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeletingFloor ? (
                    <><FiSettings className="w-4 h-4 animate-spin" /> Deleting...</>
                  ) : (
                    'Delete Floor'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {buildingToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl max-w-sm w-full p-6 shadow-2xl flex flex-col gap-4 text-center"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-rose-500 text-lg shadow-inner">
                <FiTrash2 className="w-5 h-5 animate-pulse" />
              </div>
              
              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-extrabold text-slate-850 dark:text-slate-105 tracking-wide">
                  Delete Entire Building?
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-1">
                  Are you sure you want to delete <strong className="text-slate-700 dark:text-slate-200">"{buildingToDelete.name}"</strong>? This will permanently delete ALL floors, map data, and Points of Interest associated with this building! This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setBuildingToDelete(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-850 active:scale-95 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await useMapStore.getState().deleteBuilding(buildingToDelete.id);
                    setBuildingToDelete(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold transition-colors active:scale-95 shadow-lg shadow-rose-500/20 cursor-pointer"
                >
                  Delete Building
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showQrModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-sm print:bg-white print:p-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="qr-print-modal bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl max-w-4xl w-full p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] print:max-h-none print:shadow-none print:border-none print:w-full print:max-w-none print:m-0"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <FiPrinter className="text-sky-500" /> Export QR Codes (Scan & Go)
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Print these QR codes and place them at physical locations. When users scan them, the app will automatically open at that exact location.
                  </p>
                </div>
                <button onClick={() => setShowQrModal(false)} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              <div className="overflow-y-auto flex-1 p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 print:overflow-visible print:grid-cols-3 print:gap-4 print:p-0">
                {nodes.filter(n => n.floor === currentFloor && n.category !== 'waypoint').length === 0 ? (
                  <div className="col-span-full py-10 text-center text-slate-400 print:hidden">
                    No points of interest found on this floor to generate QR codes for.
                  </div>
                ) : (
                  nodes.filter(n => n.floor === currentFloor && n.category !== 'waypoint').map(node => {
                    const qrUrl = `${window.location.origin}/app?startNode=${node.id}`;
                    return (
                      <div key={node.id} className="flex flex-col items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white text-black text-center shadow-sm break-inside-avoid">
                        <div className="w-full max-w-[120px] aspect-square flex items-center justify-center mb-3">
                          <QRCodeCanvas id={`qr-canvas-${node.id}`} value={qrUrl} style={{ width: '100%', height: '100%' }} level="H" />
                        </div>
                        <span className="font-extrabold text-[14px] leading-tight break-words w-full text-slate-800">
                          {node.name || node.label || node.category}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1 uppercase font-mono tracking-wider">
                          ID: {node.id.slice(-8)}
                        </span>
                      </div>
                    )
                  })
                )}
              </div>
              
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                <button
                  onClick={handleDownloadZip}
                  disabled={isGeneratingZip || nodes.filter(n => n.floor === currentFloor && n.category !== 'waypoint').length === 0}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-bold rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-2.5 transition-all active:scale-95 cursor-pointer"
                >
                  {isGeneratingZip ? (
                    <><FiSettings className="animate-spin w-4 h-4" /> Generating ZIP...</>
                  ) : (
                    <><FiArchive className="w-4 h-4" /> Download ZIP</>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
