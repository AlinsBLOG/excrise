 /* jshint esversion: 6 */ 
import Vue from 'vue';
import Router from 'vue-router';
import App from '../App';
import Index from '@/pages/index';
import Adviser from '@/pages/adviser';
import CaseList from '@/pages/caseList';
import CaseDetail from '@/pages/caseDetail';
import Project from '@/pages/project';
import Sponsor from '@/pages/project/sponsor';
import SponsorSuccess from '@/pages/project/sponsorSuccess';
import ApplyMessage from '@/pages/project/applyMessage';
import UserApply from '@/pages/project/userApply';
import ProjectInfo from '@/pages/project/info';
import SearchAdviser from '@/pages/adviser/search';
import AdviserInfo from '@/pages/adviser/info';
import Profile from '@/pages/profile';
import Info from '@/pages/profile/info';
import Collection from '@/pages/profile/collection';
import MyProject from '@/pages/profile/project';
import Login from '@/pages/login';
import LoginByPhone from '@/pages/login/loginByPhone';
import LoginSuccess from '@/pages/login/loginSuccess';
import Register from '@/pages/register';
import ApplyAdviser from '@/pages/applyAdviser';
import Test from '@/pages/test';
import Assess from '@/pages/assess';
import AssessDetail from '@/pages/assessDetail';

Vue.use(Router);

Router.prototype.goBack = function () { 
　　this.isBack = true;
　　window.history.go(-1);
};

export default new Router({
  routes: [
    { 
    	path: '/', 
    	component: App,
    	children: [
			{ 
		    	path: '',
            	redirect: '/index'
			},
			{ 
		    	path: 'test',
            	component: Test
			},
			{ 
		    	path: 'assess',
            	component: Assess
			},
			{ 
		    	path: 'assessDetail',
            	component: AssessDetail
		    },
		    { 
		    	path: 'index', 
		    	component: Index 
		    },
		    { 
		    	path: 'adviser', 
		    	component: Adviser,
			},
			{
				path: 'caseList',
				component: CaseList,
			},
			{ 
		    	path: 'caseDetail', 
		    	component: CaseDetail,
		    },
		    { 
		    	path: 'project', 
		    	component: Project,
		    },
		    { 
		    	path: 'project/sponsor',
		    	component: Sponsor 
		    },
		    { 
		    	path: 'project/sponsorSuccess',
		    	component: SponsorSuccess
		    },
		    { 
		    	path: 'project/applyMessage',
		    	name: 'ApplyMessage',
		    	component: ApplyMessage 
		    },
		    { 
		    	path: 'project/userApply',
		    	name: 'UserApply',
		    	component: UserApply 
		    },
		    { 
		    	path: 'project/info/:id',
		    	name: 'ProjectInfo',
		    	component: ProjectInfo 
		    },
		    {
		    	
	    		path: 'adviser/search', 
    			component: SearchAdviser,
			    	
		    }, 
		    { 
		    	
	    		path: 'adviser/info', 
    			component: AdviserInfo,
			    	
		    },
		    { 
		    	path: 'profile', 
		    	component: Profile 
			},
			{ 
		    	path: 'profile/info', 
		    	component: Info 
			},
			{ 
		    	path: 'profile/collection', 
		    	component: Collection 
			},
			{ 
		    	path: 'profile/my-project', 
		    	component: MyProject 
		    },
		    { 
		    	path: 'login', 
		    	component: Login 
			},
			{ 
		    	path: 'loginByPhone', 
		    	component: LoginByPhone 
			},
			{ 
		    	path: 'loginSuccess', 
		    	component: LoginSuccess 
		    },
		    { 
		    	path: 'register', 
		    	component: Register 
		    },
		    { 
		    	path: 'applyAdviser', 
		    	component: ApplyAdviser 
		    },
    	]
    }
  ],
  // 路由切换页面始终回到最顶部
  scrollBehavior(to, from, savedPosition) {
    return { y: 0 };
  }
});
