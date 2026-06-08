import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { Select } from './Select';
import type { Pagination } from '../../types';

interface TablePaginationProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const PAGE_SIZE_OPTIONS = [
  { value: '10', label: '10 per page' },
  { value: '25', label: '25 per page' },
  { value: '50', label: '50 per page' },
];

export const TablePagination = ({
  pagination,
  onPageChange,
  onLimitChange,
}: TablePaginationProps) => {
  const { page, limit, total, totalPages } = pagination;
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="mt-5 flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-muted sm:text-sm">
        Showing <span className="font-medium text-foreground">{start}</span>–
        <span className="font-medium text-foreground">{end}</span> of{' '}
        <span className="font-medium text-foreground">{total}</span> records
        {totalPages > 1 && (
          <span className="text-muted"> · Page {page} of {totalPages}</span>
        )}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <Select
          label="Rows"
          value={String(limit)}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          options={PAGE_SIZE_OPTIONS}
          className="min-w-[130px]"
        />

        <div className="flex items-center gap-1">
          <Button
            variant="secondary"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="min-w-[4rem] text-center text-xs font-medium text-foreground sm:text-sm">
            {page} / {Math.max(totalPages, 1)}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page >= totalPages || totalPages === 0}
            onClick={() => onPageChange(page + 1)}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
