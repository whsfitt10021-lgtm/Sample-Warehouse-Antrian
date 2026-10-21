// Data contoh. Jam "sekarang" dibuat tetap 12:19 supaya durasi konsisten.
var SEKARANG = 12 * 60 + 19;
var TARGET_MUAT = 75; // menit

var NAMA_STATUS = {
  MASUK: "Menunggu",
  SPM: "SPM dibagi",
  LOADING: "Loading",
  SELESAI: "Selesai muat",
  RECEIVED: "Sedang dicek",
  COMPLETED: "Selesai dicek",
  KELUAR: "Keluar"
};

var data = [
  { urutDatang: 1,  plat: "BK 8231 AF", jenis: "Tronton",     tujuan: "Medan",           jamMasuk: "06:05", spm: "2736272", urutMuat: 1,  mulaiMuat: "06:20", selesaiMuat: "07:12", mulaiCek: "07:20", selesaiCek: "07:41", keluar: "07:55", status: "KELUAR" },
  { urutDatang: 2,  plat: "BK 9114 TP", jenis: "Fuso",        tujuan: "Binjai",          jamMasuk: "06:12", spm: "2736273", urutMuat: 2,  mulaiMuat: "06:34", selesaiMuat: "07:20", mulaiCek: "07:28", selesaiCek: "07:52", keluar: "08:10", status: "KELUAR" },
  { urutDatang: 3,  plat: "BK 8870 QA", jenis: "Trailer",     tujuan: "Tebing Tinggi",   jamMasuk: "06:30", spm: "2736275", urutMuat: 4,  mulaiMuat: "07:05", selesaiMuat: "08:31", mulaiCek: "08:40", selesaiCek: "09:05", keluar: "09:20", status: "KELUAR" },
  { urutDatang: 4,  plat: "BK 9302 XK", jenis: "Colt Diesel", tujuan: "Lubuk Pakam",     jamMasuk: "06:41", spm: "2736274", urutMuat: 3,  mulaiMuat: "06:58", selesaiMuat: "07:40", mulaiCek: "07:46", selesaiCek: "08:05", keluar: "08:20", status: "KELUAR" },
  { urutDatang: 5,  plat: "BK 8456 LS", jenis: "Fuso",        tujuan: "Pematangsiantar", jamMasuk: "07:02", spm: "2736276", urutMuat: 5,  mulaiMuat: "07:31", selesaiMuat: "08:44", mulaiCek: "08:55", selesaiCek: "09:20", keluar: "09:35", status: "KELUAR" },
  { urutDatang: 6,  plat: "BK 9677 MN", jenis: "Tronton",     tujuan: "Kisaran",         jamMasuk: "07:20", spm: "2736278", urutMuat: 6,  mulaiMuat: "08:02", selesaiMuat: "09:05", mulaiCek: "09:12", selesaiCek: "09:30", keluar: "09:48", status: "KELUAR" },
  { urutDatang: 7,  plat: "BK 8012 DR", jenis: "Trailer",     tujuan: "Medan",           jamMasuk: "07:48", spm: "2736279", urutMuat: 7,  mulaiMuat: "08:15", selesaiMuat: "10:02", mulaiCek: "10:10", status: "RECEIVED" },
  { urutDatang: 8,  plat: "BK 9540 BB", jenis: "Fuso",        tujuan: "Binjai",          jamMasuk: "08:10", spm: "2736281", urutMuat: 9,  mulaiMuat: "09:20", selesaiMuat: "10:41", status: "SELESAI" },
  { urutDatang: 9,  plat: "BK 8795 CH", jenis: "Colt Diesel", tujuan: "Medan",           jamMasuk: "08:35", spm: "2736280", urutMuat: 8,  mulaiMuat: "09:05", selesaiMuat: "09:58", mulaiCek: "10:25", selesaiCek: "10:50", status: "COMPLETED" },
  { urutDatang: 10, plat: "BK 9203 RA", jenis: "Tronton",     tujuan: "Tebing Tinggi",   jamMasuk: "09:05", spm: "2736282", urutMuat: 10, mulaiMuat: "10:58", status: "LOADING" },
  { urutDatang: 11, plat: "BK 8661 PK", jenis: "Fuso",        tujuan: "Lubuk Pakam",     jamMasuk: "09:40", spm: "2736284", urutMuat: 11, mulaiMuat: "11:42", status: "LOADING" },
  { urutDatang: 12, plat: "BK 9448 SD", jenis: "Trailer",     tujuan: "Kisaran",         jamMasuk: "10:25", spm: "2736285", urutMuat: 12, mulaiMuat: "12:01", status: "LOADING" },
  { urutDatang: 13, plat: "BK 8127 YT", jenis: "Fuso",        tujuan: "Pematangsiantar", jamMasuk: "11:10", spm: "2736287", status: "SPM" },
  { urutDatang: 14, plat: "BK 9031 WE", jenis: "Colt Diesel", tujuan: "Medan",           jamMasuk: "11:46", status: "MASUK" },
  { urutDatang: 15, plat: "BK 8588 JJ", jenis: "Tronton",     tujuan: "Binjai",          jamMasuk: "12:04", status: "MASUK" }
];

var FILTER = [
  ["semua", "Semua"],
  ["menunggu", "Menunggu"],
  ["loading", "Loading"],
  ["selesai", "Selesai"]
];

var state = { cari: "", filter: "semua" };

function el(id) { return document.getElementById(id); }

// ---------- helper hitung ----------

function keMenit(jam) {
  var p = jam.split(":");
  return Number(p[0]) * 60 + Number(p[1]);
}

// durasi muat (menit). Kalau belum selesai, dihitung sampai sekarang.
function durasiMuat(m) {
  if (!m.mulaiMuat) return null;
  var akhir = m.selesaiMuat ? keMenit(m.selesaiMuat) : SEKARANG;
  return akhir - keMenit(m.mulaiMuat);
}

function lamaTunggu(m) {
  var mulai = m.mulaiMuat ? keMenit(m.mulaiMuat) : SEKARANG;
  return mulai - keMenit(m.jamMasuk);
}

// selisih urutan muat terhadap urutan datang (0 = sesuai)
function selisihUrutan(m) {
  return m.urutMuat == null ? null : m.urutMuat - m.urutDatang;
}

function lewatTarget(m) {
  var d = durasiMuat(m);
  return d != null && d > TARGET_MUAT;
}

function kelompok(m) {
  if (m.status === "MASUK" || m.status === "SPM") return "menunggu";
  if (m.status === "LOADING") return "loading";
  return "selesai";
}

function keterangan(m) {
  var s = selisihUrutan(m);
  if (s == null) return { teks: "Belum muat", kelas: "belum" };
  if (s === 0) return { teks: "Sesuai", kelas: "ok" };
  return { teks: s < 0 ? "Maju " + (-s) : "Mundur " + s, kelas: "bad" };
}

function rataRata(angka) {
  if (!angka.length) return null;
  var total = angka.reduce(function (a, b) { return a + b; }, 0);
  return Math.round(total / angka.length);
}

function dua(n) { return n < 10 ? "0" + n : "" + n; }

function sel(nilai) {
  return nilai ? nilai : '<span class="redup">–</span>';
}

// urutan selesai muat dihitung dari jam selesai paling awal
var urutSelesai = {};
data
  .filter(function (m) { return m.selesaiMuat; })
  .sort(function (a, b) { return keMenit(a.selesaiMuat) - keMenit(b.selesaiMuat); })
  .forEach(function (m, i) { urutSelesai[m.urutDatang] = i + 1; });

// ---------- tampilan ----------

function tampilRingkasan() {
  var tidakSesuai = data.filter(function (m) {
    var s = selisihUrutan(m);
    return s != null && s !== 0;
  }).length;

  var hitung = function (k) {
    return data.filter(function (m) { return kelompok(m) === k; }).length;
  };

  var completed = data.filter(function (m) {
    return m.status === "COMPLETED" || m.status === "KELUAR";
  }).length;

  var overTarget = data.filter(lewatTarget).length;
  var rataTunggu = rataRata(data.filter(function (m) { return m.mulaiMuat; }).map(lamaTunggu));
  var rataMuat = rataRata(data.filter(function (m) { return m.selesaiMuat; }).map(durasiMuat));

  var kartu = [
    ["Total mobil", data.length, "", ""],
    ["Tidak sesuai urutan", tidakSesuai, "", tidakSesuai ? "bad" : "ok"],
    ["Menunggu", hitung("menunggu"), "", ""],
    ["Loading", hitung("loading"), "", ""],
    ["Completed", completed, "", ""],
    ["Over target", overTarget, "", overTarget ? "bad" : ""],
    ["Rata-rata tunggu", rataTunggu == null ? "-" : rataTunggu, rataTunggu == null ? "" : "mnt", ""],
    ["Rata-rata loading", rataMuat == null ? "-" : rataMuat, rataMuat == null ? "" : "mnt", ""]
  ];

  el("ringkasan").innerHTML = kartu.map(function (k) {
    var satuan = k[2] ? "<small>" + k[2] + "</small>" : "";
    return '<div class="' + k[3] + '"><span>' + k[0] + "</span><b>" + k[1] + satuan + "</b></div>";
  }).join("");
}

function tampilFilter() {
  el("filter").innerHTML = FILTER.map(function (f) {
    var aktif = state.filter === f[0];
    var jumlah = f[0] === "semua" ? " (" + data.length + ")" : "";
    return '<button type="button" data-filter="' + f[0] + '" class="' + (aktif ? "aktif" : "") +
      '" aria-pressed="' + aktif + '">' + f[1] + jumlah + "</button>";
  }).join("");
}

function tampilTabel() {
  var kata = state.cari.replace(/\s+/g, "").toUpperCase();

  var baris = data.filter(function (m) {
    var cocokFilter = state.filter === "semua" || kelompok(m) === state.filter;
    var cocokPlat = !kata || m.plat.replace(/\s+/g, "").indexOf(kata) >= 0;
    return cocokFilter && cocokPlat;
  }).sort(function (a, b) { return a.urutDatang - b.urutDatang; });

  // mobil yang menunggu paling awal disorot
  var yangMenunggu = data.filter(function (m) { return m.status === "MASUK"; })
    .map(function (m) { return m.urutDatang; });
  var berikutnya = yangMenunggu.length ? Math.min.apply(null, yangMenunggu) : null;

  el("subjudul").textContent = data.length
    ? data.length + " kendaraan hari ini. Hijau: urutan mulai muat sesuai kedatangan. Merah: tidak sesuai."
    : "Belum ada kendaraan hari ini.";

  if (!baris.length) {
    var pesan = data.length ? "Tidak ada yang cocok." : "Belum ada kendaraan hari ini.";
    el("isiTabel").innerHTML = '<tr><td colspan="13" class="kosong">' + pesan + "</td></tr>";
    return;
  }

  el("isiTabel").innerHTML = baris.map(function (m) {
    var ket = keterangan(m);
    var urutMuat = m.urutMuat == null
      ? sel("")
      : '<span class="urut ' + ket.kelas + '">' + dua(m.urutMuat) + "</span>";
    var kelas = (m.urutDatang === berikutnya ? "berikutnya" : "") +
      (m.status === "KELUAR" ? " sudah-keluar" : "");

    return '<tr tabindex="0" data-no="' + m.urutDatang + '" class="' + kelas + '">' +
      '<td class="tengah angka-biru">' + m.urutDatang + "</td>" +
      "<td>" + m.jamMasuk + "</td>" +
      '<td class="plat">' + m.plat + "</td>" +
      '<td class="tengah">' + urutMuat + "</td>" +
      "<td>" + sel(m.mulaiMuat) + "</td>" +
      '<td class="tengah angka-biru">' + (urutSelesai[m.urutDatang] ? dua(urutSelesai[m.urutDatang]) : sel("")) + "</td>" +
      "<td>" + sel(m.selesaiMuat) + "</td>" +
      "<td>" + sel(m.spm) + "</td>" +
      "<td>" + m.tujuan + "</td>" +
      "<td>" + m.jenis + "</td>" +
      "<td>" + sel(m.mulaiCek) + "</td>" +
      "<td>" + sel(m.selesaiCek) + "</td>" +
      "<td>" + sel(m.keluar) + "</td></tr>";
  }).join("");
}

// ---------- rincian kendaraan ----------

var barisTerakhir = null;

function selisihJam(a, b) {
  return a && b ? (keMenit(b) - keMenit(a)) + " mnt" : "–";
}

function bukaRincian(no) {
  var m = data.filter(function (x) { return x.urutDatang === no; })[0];
  var ket = keterangan(m);
  var d = durasiMuat(m);
  var lewat = lewatTarget(m);

  var teksDurasi = "–";
  if (d != null) {
    teksDurasi = d + " mnt" + (m.selesaiMuat ? "" : " (berjalan)");
    if (lewat) teksDurasi += ", melewati target " + TARGET_MUAT + " mnt";
  }

  el("rincian").innerHTML =
    "<h3>" + m.plat + '</h3><span class="redup">' + NAMA_STATUS[m.status] + "</span>" +
    "<dl>" +
    "<dt>Jenis</dt><dd>" + m.jenis + "</dd>" +
    "<dt>Tujuan</dt><dd>" + m.tujuan + "</dd>" +
    "<dt>No. SPM</dt><dd>" + (m.spm || "Belum dibagi") + "</dd>" +
    "<dt>Urutan</dt><dd>Datang ke-" + m.urutDatang + (m.urutMuat ? ", muat ke-" + m.urutMuat : "") + "</dd>" +
    '<dt>Keterangan</dt><dd><span class="tag ' + ket.kelas + '">' + ket.teks + "</span></dd>" +
    "<dt>Masuk</dt><dd>" + m.jamMasuk + "</dd>" +
    "<dt>Mulai muat</dt><dd>" + (m.mulaiMuat || "–") +
      (m.mulaiMuat ? " (tunggu " + selisihJam(m.jamMasuk, m.mulaiMuat) + ")" : "") + "</dd>" +
    "<dt>Selesai muat</dt><dd>" + (m.selesaiMuat || "–") + "</dd>" +
    '<dt>Durasi muat</dt><dd class="' + (lewat ? "lewat" : "") + '">' + teksDurasi + "</dd>" +
    "<dt>Mulai check</dt><dd>" + (m.mulaiCek || "–") + "</dd>" +
    "<dt>Selesai check</dt><dd>" + (m.selesaiCek || "–") + "</dd>" +
    "<dt>Security check out</dt><dd>" + (m.keluar || "–") + "</dd>" +
    "</dl>" +
    '<button class="btn-tutup" id="btnTutup">Tutup</button>';

  el("overlay").hidden = false;
  el("btnTutup").focus();
}

function tutupRincian() {
  el("overlay").hidden = true;
  if (barisTerakhir) barisTerakhir.focus();
}

// ---------- menu & event ----------

var MENU = [
  ["Security", "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"],
  ["Juru muat", "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"],
  ["Checker", "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"],
  ["Dashboard", "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"]
];

el("nav").innerHTML = MENU.map(function (m) {
  var aktif = m[0] === "Dashboard" ? ' class="aktif" aria-current="page"' : "";
  return '<button type="button" data-menu="' + m[0] + '"' + aktif + '>' +
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + m[1] + '"/></svg>' +
    "<span>" + m[0] + "</span></button>";
}).join("");

var timerToast;
function tampilToast(pesan) {
  var t = el("toast");
  t.textContent = pesan;
  t.hidden = false;
  clearTimeout(timerToast);
  timerToast = setTimeout(function () { t.hidden = true; }, 2200);
}

el("nav").addEventListener("click", function (e) {
  var b = e.target.closest("button");
  if (b && b.dataset.menu !== "Dashboard") {
    tampilToast("Halaman " + b.dataset.menu + " tidak termasuk dalam rancangan ini.");
  }
});

el("filter").addEventListener("click", function (e) {
  var b = e.target.closest("button");
  if (!b) return;
  state.filter = b.dataset.filter;
  tampilFilter();
  tampilTabel();
});

el("cari").addEventListener("input", function (e) {
  state.cari = e.target.value;
  tampilTabel();
});

el("isiTabel").addEventListener("click", function (e) {
  var r = e.target.closest("tr[data-no]");
  if (r) {
    barisTerakhir = r;
    bukaRincian(Number(r.dataset.no));
  }
});

el("isiTabel").addEventListener("keydown", function (e) {
  if (e.key === "Enter" && e.target.dataset.no) {
    barisTerakhir = e.target;
    bukaRincian(Number(e.target.dataset.no));
  }
});

el("overlay").addEventListener("click", function (e) {
  if (e.target.id === "overlay" || e.target.id === "btnTutup") tutupRincian();
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !el("overlay").hidden) tutupRincian();
});

el("btnRefresh").addEventListener("click", function () {
  var b = el("btnRefresh");
  b.classList.add("berputar");
  setTimeout(function () {
    b.classList.remove("berputar");
    tampilSemua();
  }, 700);
});

function tampilSemua() {
  tampilRingkasan();
  tampilFilter();
  tampilTabel();
}

tampilSemua();
