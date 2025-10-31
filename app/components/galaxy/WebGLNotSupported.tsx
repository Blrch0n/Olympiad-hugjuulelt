export default function WebGLNotSupported() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#060a18] text-white">
      <div className="max-w-md text-center p-8">
        <h1 className="text-3xl font-bold mb-4">Дэмжигдэхгүй байна</h1>
        <p className="text-gray-400 mb-6">
          Таны хөтөч WebGL-г дэмжихгүй байна. Энэ хуудсыг үзэхийн тулд орчин
          үеийн хөтөч ашиглана уу.
        </p>
        <a
          href="https://get.webgl.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-lg font-semibold transition"
        >
          Дэлгэрэнгүй мэдээлэл
        </a>
      </div>
    </div>
  );
}
