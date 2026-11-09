'use client';

// Silme düğmesi: tarayıcıda onay ister, sonra formu deleteCatalog aksiyonuna gönderir.
export default function SilDugmesi({ action, label }) {
  return <button className="btn btn--cizgili" type="submit" formAction={action} formNoValidate
    onClick={(e) => { if (!window.confirm(label + ' silinsin mi? Bu işlem geri alınamaz.')) e.preventDefault(); }}>
    Sil
  </button>;
}
