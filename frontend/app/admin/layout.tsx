import Link from "next/link";
import { LayoutDashboard, Users, Image as ImageIcon, FileText, Calendar, Settings, MessageSquare, LogOut, Package as PackageIcon, Type, HelpCircle } from "lucide-react";
import { logout } from "@/app/login/actions";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-secondary text-white hidden md:flex flex-col">
        <div className="p-6">
          <Link href="/admin" className="font-heading font-bold text-2xl text-stage-gold uppercase tracking-widest">
            Ravenous<span className="text-white">Studio</span>
          </Link>
          <p className="text-sm text-gray-400 mt-1 uppercase tracking-wider text-xs">Admin Dashboard</p>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavItem href="/admin" icon={<LayoutDashboard size={20} />} label="Overview" />
          <NavItem href="/admin/services" icon={<FileText size={20} />} label="Services" />
          <NavItem href="/admin/packages" icon={<PackageIcon size={20} />} label="Packages" />
          <NavItem href="/admin/portfolio" icon={<ImageIcon size={20} />} label="Portfolio" />
          <NavItem href="/admin/bookings" icon={<Calendar size={20} />} label="Quotes & Bookings" />
          <NavItem href="/admin/testimonials" icon={<MessageSquare size={20} />} label="Testimonials" />
          <NavItem href="/admin/customers" icon={<Users size={20} />} label="Customers" />
          <NavItem href="/admin/site-content" icon={<Type size={20} />} label="Site Content" />
          <NavItem href="/admin/faqs" icon={<HelpCircle size={20} />} label="FAQs" />
          <NavItem href="/admin/settings" icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="p-4 border-t border-gray-700">
          <form action={logout}>
            <button type="submit" className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-colors">
              <LogOut size={20} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* TOPBAR (Mobile + User Profile) */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:justify-end">
          <div className="md:hidden">
            <Link href="/admin" className="font-heading font-bold text-xl text-secondary uppercase">
              Ravenous
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              {user?.email || "Admin User"}
            </span>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold uppercase">
              {user?.email?.charAt(0) || "A"}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  // In a real app, use usePathname() to determine active state
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
