export type MenuItem = {
	id: number
	title: string
	url: string
	child_items: MenuItem[] | null
	groups?: string[] | null
	parent?: string | null
}

export type Menus = {
	leftMenu: MenuItem[],
	rightMenu: MenuItem[],
	mobileMenu: MenuItem[],
	privacy: MenuItem[],
}

export type BreadCrumb = {
	name: string,
	href: string
}