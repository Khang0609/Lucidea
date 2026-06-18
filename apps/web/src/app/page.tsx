'use client';

import React, { useEffect } from 'react';
import { useAuthContext, useAuth } from '@lucidea/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@lucidea/ui';

export default function HomePage() {
  const { user, loading: authLoading, token } = useAuthContext();
  const { logout } = useAuth();
  const router = useRouter();

  // Redirect to authentication if token is missing
  useEffect(() => {
    if (!authLoading && !token) {
      router.push('/auth');
    }
  }, [authLoading, token, router]);

  // Display loading screen while validating auth session
  if (authLoading || (!user && token)) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FAF6E8] select-none font-sans antialiased text-[#2F2718]">
        <svg
          className="animate-spin h-10 w-10 text-[#C49A1B] mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span className="text-sm font-semibold text-[#8B7A5C] tracking-wide animate-pulse">
          Xác thực phiên làm việc...
        </span>
      </div>
    );
  }

  // Fallback while redirecting
  if (!user) {
    return null;
  }

  const welcomeName = user.isAnonymous ? 'Khách quý' : user.username;

  return (
    <main className="min-h-screen w-full bg-[#FAF6E8] p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center font-sans antialiased text-[#2F2718] select-none relative overflow-hidden">
      {/* Background Decorative Paws */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]">
        <svg viewBox="0 0 469 412" className="absolute top-10 left-10 w-32 h-32 fill-[#C49A1B] rotate-[-15deg]">
          <path d="M116.472 193.533C128.379 230.533 117.642 260.45 90.9718 269.033C64.3016 277.616 32.9717 260.533 21.4718 214.533C11.9718 168.533 23.9718 137.227 49.9718 133.033C80.9718 128.033 108.266 168.033 116.472 193.533Z" />
          <path d="M440.07 224.888C426.205 261.199 399.109 277.817 372.935 267.823C346.761 257.829 333.013 224.899 352.827 181.822C374.201 139.996 403.151 123.085 426.056 136.084C453.366 151.582 449.626 199.862 440.07 224.888Z" />
          <path d="M214.341 88.533C218.341 129.533 197.496 159.872 167.341 161.033C137.185 162.194 104.606 139.374 108.842 83.0329C113.841 16.5331 139.747 9.03313 159.341 9.03313C192.341 9.03313 211.658 61.0304 214.341 88.533Z" />
          <path d="M356.16 101.497C349.865 142.208 325.472 162.533 296.972 162.533C264.986 162.533 237.972 118.533 257.16 61.4413C272.222 16.6262 299.179 5.58133 318.16 10.4413C350.129 18.6267 360.382 74.1887 356.16 101.497Z" />
          <path d="M109.972 301.033C84.3717 333.433 95.6384 369.2 104.472 383.033C120.872 415.833 160.972 413.366 178.972 408.033C184.972 406.533 201.172 402.433 217.972 398.033C234.772 393.633 268.972 402.866 283.972 408.033C296.305 412.2 326.572 416.033 348.972 398.033C371.372 380.033 370.972 343.2 367.972 327.033C363.305 314.366 355.972 297.283 334.972 281.533C320.972 271.033 322.472 276.033 289.972 225.533C281.965 213.092 269.972 181.533 233.972 177.533C207.943 174.641 181.472 200.533 172.472 230.533C168.1 238.611 164.472 244.033 158.472 253.533C147.827 268.836 118.721 289.96 109.972 301.033Z" />
        </svg>
        <svg viewBox="0 0 469 412" className="absolute bottom-10 right-10 w-44 h-44 fill-[#C49A1B] rotate-[20deg]">
          <path d="M116.472 193.533C128.379 230.533 117.642 260.45 90.9718 269.033C64.3016 277.616 32.9717 260.533 21.4718 214.533C11.9718 168.533 23.9718 137.227 49.9718 133.033C80.9718 128.033 108.266 168.033 116.472 193.533Z" /><path d="M440.07 224.888C426.205 261.199 399.109 277.817 372.935 267.823C346.761 257.829 333.013 224.899 352.827 181.822C374.201 139.996 403.151 123.085 426.056 136.084C453.366 151.582 449.626 199.862 440.07 224.888Z" /><path d="M214.341 88.533C218.341 129.533 197.496 159.872 167.341 161.033C137.185 162.194 104.606 139.374 108.842 83.0329C113.841 16.5331 139.747 9.03313 159.341 9.03313C192.341 9.03313 211.658 61.0304 214.341 88.533Z" /><path d="M356.16 101.497C349.865 142.208 325.472 162.533 296.972 162.533C264.986 162.533 237.972 118.533 257.16 61.4413C272.222 16.6262 299.179 5.58133 318.16 10.4413C350.129 18.6267 360.382 74.1887 356.16 101.497Z" /><path d="M109.972 301.033C84.3717 333.433 95.6384 369.2 104.472 383.033C120.872 415.833 160.972 413.366 178.972 408.033C184.972 406.533 201.172 402.433 217.972 398.033C234.772 393.633 268.972 402.866 283.972 408.033C296.305 412.2 326.572 416.033 348.972 398.033C371.372 380.033 370.972 343.2 367.972 327.033C363.305 314.366 355.972 297.283 334.972 281.533C320.972 271.033 322.472 276.033 289.972 225.533C281.965 213.092 269.972 181.533 233.972 177.533C207.943 174.641 181.472 200.533 172.472 230.533C168.1 238.611 164.472 244.033 158.472 253.533C147.827 268.836 118.721 289.96 109.972 301.033Z" /></svg>
      </div>

      {/* Main Glassmorphism Card */}
      <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-[32px] max-w-2xl w-full p-8 sm:p-10 border border-white/60 flex flex-col gap-8 relative overflow-hidden z-10">
        
        {/* Decorative Top Glow */}
        <div className="absolute -top-20 -left-20 w-44 h-44 bg-[#FFF6D6]/40 rounded-full filter blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex justify-between items-center border-b border-[#EFE9D9]/60 pb-6">
          <div className="flex items-center gap-2.5 text-[#C49A1B] text-xl font-bold tracking-tight">
            <svg viewBox="0 0 469 412" className="w-6 h-6 fill-current">
              <path d="M116.472 193.533C128.379 230.533 117.642 260.45 90.9718 269.033C64.3016 277.616 32.9717 260.533 21.4718 214.533C11.9718 168.533 23.9718 137.227 49.9718 133.033C80.9718 128.033 108.266 168.033 116.472 193.533Z" />
              <path d="M440.07 224.888C426.205 261.199 399.109 277.817 372.935 267.823C346.761 257.829 333.013 224.899 352.827 181.822C374.201 139.996 403.151 123.085 426.056 136.084C453.366 151.582 449.626 199.862 440.07 224.888Z" />
              <path d="M214.341 88.533C218.341 129.533 197.496 159.872 167.341 161.033C137.185 162.194 104.606 139.374 108.842 83.0329C113.841 16.5331 139.747 9.03313 159.341 9.03313C192.341 9.03313 211.658 61.0304 214.341 88.533Z" />
              <path d="M356.16 101.497C349.865 142.208 325.472 162.533 296.972 162.533C264.986 162.533 237.972 118.533 257.16 61.4413C272.222 16.6262 299.179 5.58133 318.16 10.4413C350.129 18.6267 360.382 74.1887 356.16 101.497Z" />
              <path d="M109.972 301.033C84.3717 333.433 95.6384 369.2 104.472 383.033C120.872 415.833 160.972 413.366 178.972 408.033C184.972 406.533 201.172 402.433 217.972 398.033C234.772 393.633 268.972 402.866 283.972 408.033C296.305 412.2 326.572 416.033 348.972 398.033C371.372 380.033 370.972 343.2 367.972 327.033C363.305 314.366 355.972 297.283 334.972 281.533C320.972 271.033 322.472 276.033 289.972 225.533C281.965 213.092 269.972 181.533 233.972 177.533C207.943 174.641 181.472 200.533 172.472 230.533C168.1 238.611 164.472 244.033 158.472 253.533C147.827 268.836 118.721 289.96 109.972 301.033Z" />
            </svg>
            <span className="uppercase tracking-[0.12em] text-sm font-black text-[#2F2718]">Lucidea</span>
          </div>
          
          <span
            className={`px-3.5 py-1 text-xs font-bold rounded-full ${
              user.isAnonymous
                ? 'bg-amber-50 text-[#C49A1B] border border-amber-200/40'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200/40'
            }`}
          >
            {user.isAnonymous ? 'Tài khoản Khách' : 'Đã Xác Minh'}
          </span>
        </div>

        {/* Welcome Block */}
        <div className="flex flex-col gap-3 text-center sm:text-left">
          <span className="text-xs font-bold text-[#8B7A5C] uppercase tracking-widest">Không gian làm việc</span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#2F2718] tracking-tight leading-tight">
            Chào mừng quay trở lại, <span className="text-[#C49A1B]">{welcomeName}</span>! 🌟
          </h1>
          <p className="text-sm font-medium text-[#8B7A5C] leading-relaxed">
            Bạn đã đăng nhập thành công vào nền tảng phát triển Lucidea. Mọi tính năng cốt lõi đang sẵn sàng phục vụ bạn.
          </p>
        </div>

        {/* Stats / Account Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Box 1: Profile Summary */}
          <div className="bg-[#FFFDF6] border border-[#E2D9C2]/50 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <span className="text-[11px] font-bold text-[#A69577] uppercase tracking-wider">Thông tin tài khoản</span>
            <div className="mt-3">
              <p className="text-xs text-[#8B7A5C] font-semibold">Tên đăng nhập:</p>
              <p className="text-base font-extrabold text-[#2F2718] mt-0.5 truncate">{user.username}</p>
            </div>
            <div className="mt-3 pt-3 border-t border-[#EFE9D9]/50">
              <p className="text-[11px] font-semibold text-[#8B7A5C]">
                Email: <span className="font-mono text-xs text-[#2F2718]">{user.email || 'N/A'}</span>
              </p>
            </div>
          </div>

          {/* Box 2: Verification Status / Call to Action */}
          <div className="bg-[#FFFDF6] border border-[#E2D9C2]/50 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <span className="text-[11px] font-bold text-[#A69577] uppercase tracking-wider">Trạng thái đồng bộ</span>
            
            {user.isAnonymous ? (
              <div className="mt-2 flex flex-col gap-2.5">
                <p className="text-xs text-amber-700 font-semibold leading-normal">
                  Bạn đang dùng tài khoản tạm thời. Hãy đăng ký chính thức để không mất dữ liệu.
                </p>
                <button
                  onClick={() => router.push('/auth?view=signup')}
                  className="w-full py-2 px-3 bg-[#C49A1B] hover:bg-[#B38A14] text-white rounded-xl text-xs font-extrabold shadow-sm transition-all active:scale-[0.97]"
                >
                  Đăng ký ngay ➔
                </button>
              </div>
            ) : (
              <div className="mt-3 flex flex-col justify-center items-center py-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                <span className="text-xs font-extrabold text-emerald-700 flex items-center gap-1">
                  ✓ Dữ liệu được bảo vệ
                </span>
                <span className="text-[10px] text-emerald-600/80 font-medium mt-1">
                  Đã liên kết tài khoản đám mây
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Custom Premium Features Panel */}
        <div className="p-5 bg-gradient-to-br from-[#FFFBEF] to-[#FFF8DF] border border-[#FFE7A3]/40 rounded-2xl flex flex-col gap-2.5">
          <h3 className="text-sm font-bold text-[#2F2718] flex items-center gap-1.5">
            🚀 Trải nghiệm nhà phát triển
          </h3>
          <p className="text-xs text-[#8B7A5C] leading-relaxed">
            Các cấu phần thử nghiệm (testing components) đã được di chuyển một cách an toàn vào thư mục <code className="bg-white/80 border border-[#E2D9C2] px-1 py-0.5 rounded font-mono text-[11px]">sandbox/</code> và được bỏ qua bởi hệ thống Git để giữ mã nguồn sản phẩm luôn tinh gọn, sạch sẽ.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button onClick={logout} variant="secondary" className="sm:w-1/3">
            Đăng xuất
          </Button>
          <div className="flex-1 flex items-center justify-end">
            <span className="text-[11px] font-bold text-[#A69577]/80 tracking-wide uppercase">
              Lucidea Workspace v1.0.0
            </span>
          </div>
        </div>

      </div>
    </main>
  );
}
