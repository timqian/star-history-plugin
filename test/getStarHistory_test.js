import getStarHistory from '../src/getStarHistory';

// getStarHistory('timqian/jsCodeStructure');
(async function() {
  const history = await getStarHistory('facebook/react')
    .catch(err => {
      console.log(err);
    });
  console.log( history );
})();
