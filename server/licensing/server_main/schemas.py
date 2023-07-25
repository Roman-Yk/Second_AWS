import os
# import re
# import colander

from pkg_resources import resource_filename

# from deform import widget
from deform import Form, ZPTRendererFactory

from pyramid.i18n import get_localizer
from pyramid.threadlocal import get_current_request


def translator(term):
	return get_localizer(get_current_request()).translate(term)


current_dir_path = os.path.dirname(os.path.realpath(__file__))
deform_templates = resource_filename('deform', 'templates')
search_path = (
	resource_filename('licensing', os.path.join('templates', 'deform')),
	deform_templates
)

myrenderer = ZPTRendererFactory(search_path, translator=translator)


Form.set_default_renderer(myrenderer)

