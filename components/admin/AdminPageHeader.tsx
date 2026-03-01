"use client";

import AdminBackButton from "./AdminBackButton";

type Props = {
  title: string;
  backLabel: string;
  backHref: string;
  showBack?: boolean;
  actions?: React.ReactNode;
};

export default function AdminPageHeader({
  title,
  backLabel,
  backHref,
  showBack = true,
  actions,
}: Props) {
  return (
    <div className="mb-6">
      {showBack && <AdminBackButton label={backLabel} href={backHref} />}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold font-heading text-drd-text">
          {title}
        </h1>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
