import { DataTable, type DataTablePageEvent } from 'primereact/datatable';
import { useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import RowSelectionDialog from './Dialog';


type Item = {
    id: number;
    title: string;
    place_of_origin: string;
    artist_display: string;
    inscriptions: string | null;
    date_start: number;
    date_end: number;
};



const Table = () => {

    const [product, setProduct] = useState<Item[]>([])
    const [showDialog, setShowDialog] = useState(false);
    const [rowCountToSelect, setRowCountToSelect] = useState<number>(0);
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedItems, setSelectedItems] = useState<Item[]>([]);

    useEffect(() => {
        getdata(1)

    }, [])

    useEffect(() => {
        console.log(selectedItems)


    }, [selectedItems])




    async function getdata(pageNumber: number) {
        console.log(pageNumber)

        setLoading(true)
        const data = await fetch(`https://api.artic.edu/api/v1/artworks?page=${pageNumber}`)
        const res = await data.json()
        const extracted = res.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            place_of_origin: item.place_of_origin,
            artist_display: item.artist_display,
            inscriptions: item.inscriptions,
            date_start: item.date_start,
            date_end: item.date_end,
        }));
        console.log(extracted)
        setProduct(extracted)
        setLoading(false)
        setCurrentPage(pageNumber)

    }

    const handlePage = (e: DataTablePageEvent) => {

        if (typeof e.page === 'number') {
            getdata(e.page + 1);
        }


    };

    const handleSelection = (e: any) => {
        setSelectedItems(e.value)
    }

    const customSelectAllHeader = () => (
        <button
            onClick={() => setShowDialog(true)}
            style={{ padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
        >
            Select Rows
        </button>
    );

    const handleRowSelect = async () => {

        const itration_count = Math.ceil(rowCountToSelect / 12);
        const fetchPromises: Promise<Item[]>[] = [];

        for (let index = 0; index < itration_count; index++) {
            fetchPromises.push(FetchForRow(index + 1));
        }
        const resolved = await Promise.all(fetchPromises);
        const allFetchedData = resolved.flat();

        const currentSelection = allFetchedData.slice(0, rowCountToSelect);
        setSelectedItems(currentSelection);
        setShowDialog(false);



    }

    const FetchForRow = async (pageNumber: any) => {

        const data = await fetch(`https://api.artic.edu/api/v1/artworks?page=${pageNumber}`)
        const res = await data.json()
        const extracted = res.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            place_of_origin: item.place_of_origin,
            artist_display: item.artist_display,
            inscriptions: item.inscriptions,
            date_start: item.date_start,
            date_end: item.date_end,
        }));
        return extracted


    }



    return (
        <div className='h-screen'>
            <DataTable<any>
                value={product}
                selection={selectedItems}
                onSelectionChange={(e) => handleSelection(e)}
                dataKey="id"
                paginator
                rows={12}
                totalRecords={10791}
                lazy
                loading={loading}
                first={(currentPage - 1) * 12}
                onPage={handlePage}
            >
                <Column
                    selectionMode='multiple'
                    header={customSelectAllHeader}
                    headerStyle={{ width: '3rem' }}
                />

                <Column field="title" header="Title" />
                <Column field="place_of_origin" header="Place of Origin" />
                <Column field="artist_display" header="Artist" />
                <Column field="inscriptions" header="Inscriptions" />
                <Column field="date_start" header="Start Date" />
                <Column field="date_end" header="End Date" />
            </DataTable>

            <RowSelectionDialog
                visible={showDialog}
                onHide={() => setShowDialog(false)}
                maxRows={product.length}
                selectedCount={rowCountToSelect}
                onCountChange={setRowCountToSelect}
                onSelect={handleRowSelect}
            />


        </div>
    )
}

export default Table