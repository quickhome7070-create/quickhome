export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">

      <video
        autoPlay
        muted
        loop
        playsInline
        className="w-40 h-40 object-contain"
      >
        <source
          src="/loader.mp4"
          type="video/mp4"
        />
      </video>

    </div>
  );
}