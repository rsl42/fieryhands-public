export default function shallowQueryChange(router, path, queries) {
    router.push(
        {
            pathname: path,
            query: { ...router.query, ...queries },
        },
        undefined,
        {
            shallow: true,
        }
    );
}
