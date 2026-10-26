import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-leaf-800 mb-4">
        Pencatatan panen sawit, dari ladang sampai PKS
      </h1>
      <p className="text-gray-600 max-w-xl mx-auto mb-8">
        AgriTrace adalah contoh aplikasi: petani mencatat setiap batch panen,
        pabrik kelapa sawit (PKS) meninjau dan menyetujuinya. Dibuat sebagai
        target latihan QA &amp; audit keamanan, bukan produk komersial.
      </p>
      <div className="flex gap-3 justify-center">
        <Link
          to="/register"
          className="bg-leaf-700 hover:bg-leaf-800 text-white px-5 py-2.5 rounded-md font-medium"
        >
          Mulai Daftar
        </Link>
        <Link
          to="/login"
          className="border border-leaf-700 text-leaf-700 hover:bg-leaf-100 px-5 py-2.5 rounded-md font-medium"
        >
          Masuk
        </Link>
      </div>
    </div>
  );
}
