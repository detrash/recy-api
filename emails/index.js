"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculatorSupportEmail = void 0;
const components_1 = require("@react-email/components");
const React = __importStar(require("react"));
const CalculatorSupportEmail = ({ companyType, employeesQuantity, wasteFootPrint, }) => {
    return (React.createElement(components_1.Html, null,
        React.createElement(components_1.Head, null),
        React.createElement(components_1.Preview, null, "Recy Network Waste Footprint Calculator"),
        React.createElement(components_1.Body, { style: main },
            React.createElement(components_1.Container, { style: container },
                React.createElement(components_1.Img, { src: "https://detrash-public.s3.amazonaws.com/images/recy-logo.png", width: "48", alt: "Recy Networking" }),
                React.createElement(components_1.Section, null,
                    React.createElement(components_1.Text, { style: text },
                        "Thank you for contacting us, we wanted to inform you that we will be reaching out to you shortly. Please stay tuned for our upcoming communication.",
                        ' '),
                    React.createElement(components_1.Text, { style: text },
                        "Company Type: ",
                        companyType),
                    React.createElement(components_1.Text, { style: text },
                        "Employees Quantity: ",
                        employeesQuantity,
                        " "),
                    React.createElement(components_1.Text, { style: text },
                        "Waste Footprint: ",
                        wasteFootPrint,
                        " "))))));
};
exports.CalculatorSupportEmail = CalculatorSupportEmail;
exports.CalculatorSupportEmail.PreviewProps = {
    companyType: 'Acme Inc.',
    employeesQuantity: 40,
    wasteFootPrint: 2400,
};
exports.default = exports.CalculatorSupportEmail;
const main = {
    backgroundColor: '#f6f9fc',
    padding: '10px 0',
};
const container = {
    backgroundColor: '#ffffff',
    border: '1px solid #f0f0f0',
    padding: '45px',
};
const text = {
    fontSize: '16px',
    fontFamily: "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
    fontWeight: '300',
    color: '#020817',
    lineHeight: '26px',
};
//# sourceMappingURL=index.js.map