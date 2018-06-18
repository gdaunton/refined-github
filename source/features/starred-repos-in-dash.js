import {h} from 'dom-chef';
import select from 'select-dom';
import api from '../libs/api';
import {getUsername} from '../libs/utils';
import * as icons from '../libs/icons';

function renderStarListItem(repo) {
	return (
		<li class="public source ">
			<a href={repo.html_url} class="mini-repo-list-item css-truncate">
				{icons.repo()}
				<span class="repo-and-owner css-truncate-target">
					<span class="owner css-truncate-target" title={repo.owner.login}>{repo.owner.login}</span>
          /
					<span class="repo" title={repo.name}>{repo.name}</span>
				</span>
			</a>
		</li>
	);
}

function renderStarList(stars) {
	if (stars.length === 0) {
		return (<p class="notice">You haven't starred any repositories yet!</p>);
	}

	return stars.map(star => renderStarListItem(star));
}

function renderError() {
	return (<p class="notice">Error fetching starred repositories.</p>);
}

function generateStaredRepoList(content) {
	return (
		<div class="boxed-group flush js-repos-container" data-pjax-container="" role="navigation">
			<h3>
        Starred repositories
			</h3>
			<div class="boxed-group-inner">
				<ul class="list-style-none mini-repo-list">
					{content}
				</ul>
			</div>
		</div>
	);
}

export default async () => {
	const dashboardSidebar = select('.dashboard-sidebar');
	if (dashboardSidebar) {
		const res = await api(`user/starred`, false);

		let starList;
		if (res.error) {
			console.error('You must provide a personal token to use the starred-repos-in-dash feature.');
			starList = generateStaredRepoList(renderError());
		} else {
			starList = generateStaredRepoList(renderStarList(res.data));
		}
		dashboardSidebar.prepend(starList);
	}
};
