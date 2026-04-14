export class CursorConnectionUtils {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  // eslint-disable-next-line consistent-return
  static unwrapNodesAndEdges = (object: any): any => {
    try {
      if (!object) return object;

      if (object.node || object.edges) {
        return CursorConnectionUtils.unwrapNodesAndEdges(object.node || object.edges);
      }

      if (Array.isArray(object)) {
        return object.map(item => CursorConnectionUtils.unwrapNodesAndEdges(item));
      }

      if (typeof object === 'object') {
        const newObject: Record<string, any> = {}; // Use Record<string, any> for dynamic keys

        // eslint-disable-next-line array-callback-return
        Object.entries(object).map(entry => {
          newObject[entry[0]] = CursorConnectionUtils.unwrapNodesAndEdges(entry[1]);
        });

        return newObject;
      }

      return object;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('Error:', err);
      // eslint-disable-next-line no-console
      console.log('Object:', object);
    }
  };
}
