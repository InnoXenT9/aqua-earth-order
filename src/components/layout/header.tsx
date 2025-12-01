'use client';

import Link from 'next/link';
import {
  Package,
  User,
  LogIn,
  LogOut,
  LayoutDashboard,
  Menu as MenuIcon,
} from 'lucide-react';
import { useUser, useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CartSheet } from '@/components/cart/cart-sheet';
import { Logo } from '@/components/ui/logo';
import { signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';


const navLinks = [
  { href: '/', label: 'Menu' },
  { href: '/orders', label: 'My Orders' },
];

export function Header() {
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().isAdmin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [user, firestore]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-primary">
            <AvatarImage src={user?.photoURL ?? ''} alt={user?.displayName ?? 'User'} />
            <AvatarFallback>
              {user?.email?.charAt(0).toUpperCase() ?? <User />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.displayName ?? 'Welcome'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/orders')}>
          <Package className="mr-2" />
          My Orders
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem onClick={() => router.push('/admin')}>
            <LayoutDashboard className="mr-2" />
            Admin Dashboard
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const AuthButtons = () => (
    <div className="flex items-center gap-2">
      <Button asChild variant="ghost">
        <Link href="/login">
          <LogIn className="mr-2" /> Login
        </Link>
      </Button>
      <Button asChild>
        <Link href="/signup">Sign Up</Link>
      </Button>
    </div>
  );
  
  const NavLinks = ({ inSheet = false }: { inSheet?: boolean }) => (
    navLinks.map(link => (
      <Button key={link.href} variant="ghost" asChild onClick={() => inSheet && setMobileMenuOpen(false)}>
        <Link href={link.href}>{link.label}</Link>
      </Button>
    ))
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="md:hidden mr-4">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Logo className="mb-8" />
              <nav className="flex flex-col gap-4">
                <NavLinks inSheet />
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <div className="mr-auto hidden md:flex">
          <Logo />
        </div>
        
        <div className="flex-1 text-center md:hidden">
            <Logo className="inline-flex"/>
        </div>

        <nav className="hidden md:flex md:items-center md:gap-4">
          <NavLinks />
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <CartSheet />
          {user ? <UserMenu /> : <AuthButtons />}
        </div>
      </div>
    </header>
  );
}