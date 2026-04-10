export const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 glass-nav py-4 px-8 flex justify-between items-center">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-vfxGreen rounded-lg rotate-45 shadow-[0_0_10px_#00FFC2]"></div>
      <span className="text-xl font-black tracking-tighter glow-text">VFX NEXUS</span>
    </div>
    <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
      <a href="#" className="hover:text-vfxGreen transition">BROWSE</a>
      <a href="#" className="hover:text-vfxGreen transition">SUPPORT</a>
    </div>
  </nav>
);