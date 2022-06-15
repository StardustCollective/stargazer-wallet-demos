import {useState, useEffect} from 'react';

const DemosRequireContext = require.context('.', true, /\w+\/index\.tsx/, 'eager');

const DemoViews = () => {
  const [demos, setDemos] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    (async () => {
      const components = await Promise.all(
        DemosRequireContext.keys().map(async (moduleId) => {
          const module = await DemosRequireContext(moduleId);
          const Component = module.default ?? (() => null);
          return <Component key={moduleId} />;
        })
      );

      setDemos(components);
    })();
  }, []);

  return <>{demos}</>;
};

export {DemoViews};
