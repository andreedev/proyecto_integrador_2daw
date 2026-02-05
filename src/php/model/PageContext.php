<?php

readonly class PageContext{
    public function __construct(
        public int $totalRecords,
        public int $totalPages,
        public int $currentPage,
        public int $pageSize,
        public array $list
    ) {}

    /**
     * @param int $totalRecords
     * @param int $currentPage
     * @param int $pageSize
     * @param array $list
     * @return self
     */
    public static function create(
        int $totalRecords,
        int $currentPage,
        int $pageSize,
        array $list
    ): self {
        if ($totalRecords == 0) {
            return new self(0, 0, $currentPage, $pageSize, []);
        }

        $totalPages = (int) ceil($totalRecords / $pageSize);

        return new self(
            $totalRecords,
            $totalPages,
            $currentPage,
            $pageSize,
            $list
        );
    }
}