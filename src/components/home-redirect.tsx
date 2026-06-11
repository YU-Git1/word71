"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function HomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/words");
  }, [router]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="accent-text text-sm font-semibold uppercase tracking-[0.28em]">
        Professional Vocabulary
      </p>
      <h2 className="theme-title mt-4 text-4xl font-semibold">正在进入学习页</h2>
      <p className="theme-body mt-4 text-base leading-8">
        如果没有自动跳转，请点击下面按钮继续。
      </p>
      <Link
        href="/words"
        className="theme-button-primary mt-8 rounded-full px-6 py-3 text-sm font-semibold"
      >
        打开学习页
      </Link>
    </div>
  );
}
