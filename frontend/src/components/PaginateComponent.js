import React from 'react';
import { useDispatch } from 'react-redux';
import Pagination from 'react-bootstrap/Pagination'

const PaginateComponent = ({ userInfo, keyword, page, pages, pageSize, setPageNumber, action }) => {

    const dispatch = useDispatch();

    return (
        <Pagination>
            <Pagination.Prev
                onClick={() => setPageNumber(page - 1)}
                disabled={page === 1}
            />
            {[...Array(pages).keys()].map(x => (
                [0, 1, pages - 2, pages - 1].includes(x) ? (
                    <Pagination.Item
                        key={x + 1}
                        active={x + 1 === page}
                        onClick={() => {
                            dispatch(action({
                                practice: userInfo.consultantProfil.practice,
                                keyword: keyword,
                                pageNumber: x+1,
                                pageSize: pageSize,
                            }));
                            setPageNumber(x + 1);
                        }}
                    >{x + 1}</Pagination.Item>
                ) : (pages > 4 && x === 2) && (
                    <Pagination.Ellipsis key={x + 1} />
                )
            ))}
            <Pagination.Next
                onClick={() => setPageNumber(page + 1)}
                disabled={page === pages}
            />
        </Pagination>
    )
}

export default PaginateComponent;
