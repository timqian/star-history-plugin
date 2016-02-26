import "babel-polyfill"; // for async/await http://babeljs.io/docs/usage/polyfill/
import d3 from 'd3';
import nv from 'nvd3';
import getStarHistory from './getStarHistory';

// make link clickable - http://stackoverflow.com/questions/8915845/chrome-extension-open-a-link-from-popup-html-in-a-new-tab
window.addEventListener('click',function(e){
  if(e.target.href!==undefined){
    chrome.tabs.create({url:e.target.href})
  }
})

// used to store date and star numbers
let data = [];

chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
  document.getElementById('chart').style.display = 'none';
  document.getElementById('theGif').style.display = 'block';

  const tab = tabs[0];
  const url = tab.url + '\/';
  console.assert(typeof url == 'string', 'tab.url should be a string');

  // get repo from tab url
  let repo;
  try {
    repo = /github.com\/(\S*?\/\S*?)[\/#?]/.exec(url)[1];
  } catch (err) {
    document.getElementById('container').innerHTML = '<h2>No repo found</h2>';
    throw 'no repo found';
  }

  console.log("repo", repo);

  const starHistory = await getStarHistory(repo).catch(e => { document.getElementById('container').innerHTML = `<h2>${e}</h2>`;});
  console.log(starHistory);

  // 新数据集
  data.push({
    key: repo,
    values: starHistory.map((item) => {
      return {
        x: new Date(item.date),
        y: Number(item.starNum)
      }
    }),
  });
  console.log(JSON.stringify(data));

  nv.addGraph(function() {
    var chart = nv.models.lineChart()
      .useInteractiveGuideline(true)
      .color(d3.scale.category10().range());

    chart.xAxis
      .tickFormat(function(d) {
        return d3.time.format('%x')(new Date(d))
      });

    chart.yAxis
      .axisLabel('Stars')
      .tickFormat(d3.format('d'));

    d3.select('#chart svg')
      .datum(data)
      .transition().duration(500)
      .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
  });

  document.getElementById('chart').style.display = 'block';
  document.getElementById('theGif').style.display = 'none';

});
