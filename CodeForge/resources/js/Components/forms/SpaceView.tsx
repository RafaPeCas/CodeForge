import "./SpaceView.css";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";

interface PaginationProps {
    pagination: {
        current_page: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
    };
    onPageChange: (page: number) => void;
}

export const View = ({ pagination, onPageChange }: PaginationProps) => {
    return (
        <Pagination>
            <PaginationContent>
                {/* Botón de página anterior */}
                {pagination.prev_page_url && (
                    <PaginationItem>
                        <PaginationPrevious href="#" onClick={() => onPageChange(pagination.current_page - 1)} />
                    </PaginationItem>
                )}

                {/* Páginas intermedias */}
                {[...Array(pagination.last_page)].map((_, index) => (
                    <PaginationItem key={index}>
                        <PaginationLink
                            href="#"
                            onClick={() => onPageChange(index + 1)}
                            className={pagination.current_page === index + 1 ? "font-bold" : ""}
                        >
                            {index + 1}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {/* Botón de página siguiente */}
                {pagination.next_page_url && (
                    <PaginationItem>
                        <PaginationNext href="#" onClick={() => onPageChange(pagination.current_page + 1)} />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
};
