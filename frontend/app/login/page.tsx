import Link from 'next/link'
import { login } from './actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default async function LoginPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;
  
  return (
    <div className="min-h-screen bg-off-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary transition-colors font-medium"
        >
          <ArrowLeft size={16} />
          Back to site
        </Link>
      </div>
      <Card className="w-full max-w-md bg-white border-border shadow-sm">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="flex justify-center">
            <img
              src="/logo.png"
              alt="Ravenous Studio Production"
              className="h-12 w-auto"
            />
          </div>
          <CardDescription className="text-muted-foreground uppercase text-xs tracking-widest font-bold">
            Admin Authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={login} className="space-y-6">
            {searchParams?.error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                {searchParams.error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="uppercase text-xs tracking-wider font-bold">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="admin@ravenous.studio"
                required 
                className="h-12"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="uppercase text-xs tracking-wider font-bold">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="••••••••"
                required 
                className="h-12"
              />
            </div>
            
            <Button 
              type="submit"
              className="w-full h-12 font-bold tracking-widest uppercase"
            >
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <p className="text-center text-sm text-muted-foreground mt-8">
        &copy; {new Date().getFullYear()} Ravenous Studio. All rights reserved.
      </p>
    </div>
  )
}
