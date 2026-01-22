import { LayoutDashboard, Star, Filter, Settings, Search, ClipboardCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LeftRail() {
  const pathname = usePathname();

  return (
    <div className="w-[72px] bg-white border-r border-slate-200 flex flex-col items-center py-6 gap-8">
      <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-4">
        T
      </div>
      
      <Link href="/">
        <NavIcon icon={<LayoutDashboard size={24} />} active={pathname === "/"} />
      </Link>
      <Link href="/review">
        <NavIcon icon={<ClipboardCheck size={24} />} active={pathname === "/review"} />
      </Link>
      <NavIcon icon={<Star size={24} />} />
      <NavIcon icon={<Search size={24} />} />
      
      <div className="mt-auto mb-4">
        <NavIcon icon={<Settings size={24} />} />
      </div>
    </div>
  );
}

function NavIcon({ icon, active = false }: { icon: React.ReactNode; active?: boolean }) {
  return (
    <div className={`
      p-3 rounded-2xl cursor-pointer transition-all duration-200
      ${active ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}
    `}>
      {icon}
    </div>
  );
}
