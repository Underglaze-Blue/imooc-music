import Vue from 'vue';
import Router from 'vue-router';

const Recommend = () => import('components/recommend/recommend');
const Singer = () => import('components/singer/singer');
const Search = () => import('components/search/search');
const Rank = () => import('components/rank/rank');
const singerDetail = () => import('components/singerDetail/singerDetail');
const disc = () => import('components/disc/disc');
const TopList = () => import('components/topList/topList');

Vue.use(Router);

let routes = [
  {
    path: '/recommend',
    name: 'Recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        component: disc
      }
    ]
  },
  {
    path: '/singer',
    name: 'Singer',
    component: Singer,
    children: [
      {
        path: ':id',
        component: singerDetail
      }
    ]
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
    children: [
      {
        path: ':id',
        component: singerDetail
      }
    ]
  },
  {
    path: '/rank',
    name: 'Rank',
    component: Rank,
    children: [
      {
        path: ':id',
        component: TopList
      }
    ]
  },
  {
    path: '/',
    redirect: '/recommend'
  }
];

let router = new Router({
  routes
});

export default router;
