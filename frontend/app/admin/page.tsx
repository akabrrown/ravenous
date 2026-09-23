import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, DollarSign, Activity } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-secondary uppercase">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">Welcome back to Ravenous Studio Admin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Bookings" 
          value="12" 
          description="+2 from last month"
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />} 
        />
        <StatCard 
          title="Pending Quotes" 
          value="5" 
          description="3 need your response"
          icon={<Activity className="h-4 w-4 text-muted-foreground" />} 
        />
        <StatCard 
          title="Total Clients" 
          value="148" 
          description="+12 this year"
          icon={<Users className="h-4 w-4 text-muted-foreground" />} 
        />
        <StatCard 
          title="Revenue (MTD)" 
          value="₵ 45,200" 
          description="+18% from last month"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading uppercase text-secondary">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground italic">Database connected, activity will appear here...</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading uppercase text-secondary">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground italic">Database connected, events will appear here...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, description, icon }: { title: string; value: string; description: string; icon: React.ReactNode }) {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-secondary">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
