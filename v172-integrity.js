/* Dijital Makinacı V17.2 — Veri bütünlüğü ve hesaplama doğrulama katmanı */
(() => {
  'use strict';

  const originalPartBody = partBody;

  function setPartQuantityEditState(isEditing, currentQuantity = '') {
    const el = $('partQty');
    if (!el) return;
    el.disabled = !!isEditing;
    el.readOnly = !!isEditing;
    el.title = isEditing
      ? 'Mevcut stok miktarı kart düzenlemeden değiştirilemez. Giriş / Çıkış işlemlerini kullan.'
      : 'Yeni stok kartı için açılış miktarı';
    if (isEditing) el.value = currentQuantity ?? '';
  }

  // Stok kartı düzenlenirken miktarın hareket geçmişi bypass edilerek değiştirilmesini engelle.
  window.editPart = function editPartV172(id) {
    const x = parts.find(p => p.id == id);
    if (!x) return;

    editingPart = id;
    const map = {
      partName: 'name',
      partCode: 'part_code',
      partCategory: 'category',
      partMinQty: 'min_quantity',
      partUnit: 'unit',
      partLocation: 'location',
      partSupplier: 'supplier',
      partCost: 'unit_cost',
      partNote: 'note'
    };

    Object.entries(map).forEach(([idKey, dataKey]) => {
      const el = $(idKey);
      if (el) el.value = x[dataKey] ?? '';
    });

    setPartQuantityEditState(true, x.quantity);
    $('partFormTitle').textContent = 'Stok kartını düzenle';
    $('partSaveText').textContent = 'Değişiklikleri kaydet';
    $('partCancelEdit').classList.remove('hide');
    focusPartForm();
  };

  window.cancelPartEdit = function cancelPartEditV172() {
    editingPart = null;
    ['partName','partCode','partQty','partMinQty','partLocation','partSupplier','partCost','partNote']
      .forEach(id => { if ($(id)) $(id).value = ''; });

    if ($('partCategory')) $('partCategory').value = 'Rulman';
    if ($('partUnit')) $('partUnit').value = 'adet';
    setPartQuantityEditState(false, '');
    $('partFormTitle').textContent = 'Yeni parça';
    $('partSaveText').textContent = 'Stok kartını kaydet';
    $('partCancelEdit').classList.add('hide');
  };

  window.savePart = async function savePartV172() {
    try {
      const isEdit = !!editingPart;
      const body = originalPartBody();

      if (isEdit) {
        const current = parts.find(p => p.id == editingPart);
        if (!current) throw Error('Düzenlenen stok kartı bulunamadı');
        // UI değiştirilse bile API'ye mevcut stok miktarını geri gönder.
        body.quantity = current.quantity;
      } else {
        const openingQty = Number(body.quantity || 0);
        if (!Number.isFinite(openingQty) || openingQty < 0) {
          throw Error('Açılış stok miktarı 0 veya daha büyük olmalı');
        }
      }

      const minQty = Number(body.min_quantity || 0);
      const unitCost = Number(body.unit_cost || 0);
      if (!Number.isFinite(minQty) || minQty < 0) throw Error('Minimum stok 0 veya daha büyük olmalı');
      if (!Number.isFinite(unitCost) || unitCost < 0) throw Error('Birim maliyet 0 veya daha büyük olmalı');

      const url = isEdit ? `/api/parts/${editingPart}` : '/api/parts';
      await api(url, {
        method: isEdit ? 'PUT' : 'POST',
        body: JSON.stringify(body)
      });

      toast(isEdit ? 'Stok kartı güncellendi' : 'Stok kartı eklendi');
      cancelPartEditV172();
      await loadParts();
      await loadDashboard();
    } catch (e) {
      toast(e.message);
    }
  };

  const positive = (value, label) => {
    if (!Number.isFinite(value) || value <= 0) throw Error(`${label} 0’dan büyük olmalı`);
  };

  const nonNegative = (value, label) => {
    if (!Number.isFinite(value) || value < 0) throw Error(`${label} negatif olamaz`);
  };

  const positiveInteger = (value, label) => {
    positive(value, label);
    if (!Number.isInteger(value)) throw Error(`${label} tam sayı olmalı`);
  };

  function validateToolValues(key, v) {
    switch (key) {
      case 'lathe':
        positive(v[0], 'Kesme hızı');
        positive(v[1], 'Çap');
        positive(v[2], 'İlerleme');
        break;
      case 'mill':
        positive(v[0], 'Kesme hızı');
        positive(v[1], 'Çap');
        positiveInteger(v[2], 'Diş sayısı');
        positive(v[3], 'Diş başı ilerleme');
        break;
      case 'drill':
        positive(v[0], 'Kesme hızı');
        positive(v[1], 'Matkap çapı');
        break;
      case 'thread':
        positive(v[0], 'Nominal çap');
        positive(v[1], 'Adım');
        if (v[1] >= v[0]) throw Error('Adım nominal çaptan küçük olmalı');
        break;
      case 'gear':
        positive(v[0], 'Modül');
        positiveInteger(v[1], 'z1');
        positiveInteger(v[2], 'z2');
        positive(v[3], 'Giriş devri');
        break;
      case 'belt':
        positive(v[0], 'Giriş devri');
        positive(v[1], 'D1');
        positive(v[2], 'D2');
        break;
      case 'tolerance':
        positive(v[0], 'Nominal ölçü');
        if (v[1] < v[2]) throw Error('Üst sapma alt sapmadan küçük olamaz');
        break;
      case 'unit':
        nonNegative(v[0], 'Uzunluk');
        break;
      case 'hydraulic':
        nonNegative(v[0], 'Basınç');
        positive(v[1], 'Piston çapı');
        break;
      case 'cylinder':
        nonNegative(v[0], 'Debi');
        positive(v[1], 'Piston çapı');
        break;
      case 'torque':
        nonNegative(v[0], 'Güç');
        positive(v[1], 'Devir');
        break;
      case 'time':
        nonNegative(v[0], 'Mesafe');
        positive(v[1], 'İlerleme');
        break;
      case 'taper':
        positive(v[0], 'Büyük çap');
        nonNegative(v[1], 'Küçük çap');
        positive(v[2], 'Boy');
        if (v[0] < v[1]) throw Error('Büyük çap küçük çaptan küçük olamaz');
        break;
      case 'surface':
        positive(v[0], 'Çap');
        nonNegative(v[1], 'Devir');
        break;
      default:
        v.forEach((value, i) => {
          if (!Number.isFinite(value)) throw Error(`${i + 1}. değer geçersiz`);
        });
    }
  }

  window.calcTool = async function calcToolV172(key) {
    try {
      const tool = tools[key];
      if (!tool) throw Error('Hesaplama aracı bulunamadı');

      const values = tool[2].map((_, i) => parseFloat($('tv' + i).value));
      if (values.some(v => !Number.isFinite(v))) throw Error('Tüm değerleri geçerli sayı olarak doldur');

      validateToolValues(key, values);
      const result = tool[3](values);

      if (!result || /(?:NaN|Infinity|undefined)/i.test(String(result))) {
        throw Error('Girilen değerlerle geçerli bir sonuç üretilemedi');
      }

      $('toolResult').classList.remove('hide');
      $('toolResult').innerHTML = '<b>' + esc(result) + '</b>';

      await api('/api/calc-history', {
        method: 'POST',
        body: JSON.stringify({tool: tool[1], input_data: {values}, result})
      });
      await loadHistory();
    } catch (e) {
      toast(e.message);
    }
  };

  // Sayfa ilk açıldığında stok miktar alanı yeni kart modunda açık olsun.
  setPartQuantityEditState(false);
})();
